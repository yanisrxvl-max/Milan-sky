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

          logger.info('Subscription activated via webhook', {
            userId: metadata.userId,
            tier,
          });
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
