import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, SKYCOINS_PACKS } from '@/lib/stripe';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { SubscriptionTier } from '@prisma/client';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  const POINTS_MULTIPLIER = {
    'VOYEUR': 1,
    'INITIÉ': 1.5,
    'INITIE': 1.5,
    'PRIVILÈGE': 2,
    'PRIVILEGE': 2,
    'SKYCLUB': 3
  };

  const getPoints = (euroAmount: number, tier?: string) => {
    const t = tier || 'VOYEUR';
    const multiplier = POINTS_MULTIPLIER[t as keyof typeof POINTS_MULTIPLIER] || 1;
    return Math.floor(euroAmount * multiplier * 10); // 10 base points per euro
  };

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    logger.error('Webhook signature verification failed', { error: String(err) });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata?.userId) break;

        if (metadata.type === 'skycoins') {
          const coins = parseInt(metadata.coins || '0');
          if (coins <= 0) break;

          // Credit SkyCoins
          await prisma.skyCoinsBalance.upsert({
            where: { userId: metadata.userId },
            update: { balance: { increment: coins } },
            create: { userId: metadata.userId, balance: coins },
          });

          // Record transaction
          await prisma.transaction.create({
            data: {
              userId: metadata.userId,
              type: 'SKYCOINS_PURCHASE',
              amount: coins,
              euroAmount: (session.amount_total || 0) / 100,
              stripePaymentId: session.payment_intent as string,
              description: `Achat de ${coins} SkyCoins`,
            },
          });

          // Reward loyalty points
          const euroAmount = (session.amount_total || 0) / 100;
          await prisma.user.update({
            where: { id: metadata.userId },
            data: { skyPoints: { increment: getPoints(euroAmount) } },
          });

          logger.info('SkyCoins credited via webhook', {
            userId: metadata.userId,
            coins,
          });
        }

        if (session.mode === 'subscription' || metadata.type === 'subscription') {
          const tier = (metadata.tier || 'BASIC') as SubscriptionTier;
          const now = new Date();

          // Better period end calculation (fallback to 30 days if Stripe data missing)
          const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

          await prisma.subscription.upsert({
            where: { userId: metadata.userId },
            update: {
              tier,
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
              stripeCustomerId: session.customer as string,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
            create: {
              userId: metadata.userId,
              tier,
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
              stripeCustomerId: session.customer as string,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          });

          // Record transaction
          await prisma.transaction.create({
            data: {
              userId: metadata.userId,
              type: 'SUBSCRIPTION_PAYMENT',
              amount: 0,
              euroAmount: (session.amount_total || 0) / 100,
              stripePaymentId: (session.payment_intent as string) || (session.subscription as string),
              description: `Abonnement ${tier}`,
            },
          });

          // Reward loyalty points
          const euroAmount = (session.amount_total || 0) / 100;
          await prisma.user.update({
            where: { id: metadata.userId },
            data: { skyPoints: { increment: getPoints(euroAmount, tier) } },
          });

          logger.info('Subscription activated via webhook', {
            userId: metadata.userId,
            tier,
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          // Stripe periods are in seconds (UNIX timestamp)
          const lines = invoice.lines.data;
          let periodEnd = new Date();
          if (lines.length > 0 && lines[0].period) {
            periodEnd = new Date(lines[0].period.end * 1000);
          } else {
            // Fallback
            periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          }

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              status: 'ACTIVE',
              currentPeriodEnd: periodEnd
            },
          });

          // Record renewal transaction
          const existingSub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId }
          });

          if (existingSub) {
            await prisma.transaction.create({
              data: {
                userId: existingSub.userId,
                type: 'SUBSCRIPTION_PAYMENT',
                amount: 0,
                euroAmount: (invoice.amount_paid || 0) / 100,
                stripePaymentId: invoice.payment_intent as string || invoice.id,
                description: `Renouvellement Abonnement ${existingSub.tier}`,
              },
            });

            // Reward loyalty points
            const euroAmount = (invoice.amount_paid || 0) / 100;
            await prisma.user.update({
              where: { id: existingSub.userId },
              data: { skyPoints: { increment: getPoints(euroAmount, existingSub.tier) } },
            });
          }

          logger.info('Subscription renewed (invoice.paid)', { subscriptionId, periodEnd });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'CANCELLED' },
        });

        logger.info('Subscription cancelled', {
          stripeSubscriptionId: subscription.id,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: 'PAST_DUE' },
          });

          logger.warn('Subscription payment failed', { subscriptionId });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error', {
      eventType: event.type,
      error: String(error),
    });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
