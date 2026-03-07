import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { createSubscriptionCheckout, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { subscriptionSchema } from '@/lib/validations';
import { apiLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

// Get current subscription
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      subscription: subscription
        ? {
          tier: subscription.tier,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
        }
        : null,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    logger.error('Subscription fetch error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Subscribe to a plan
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = apiLimiter(ip);
    if (!success) return rateLimitResponse();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = subscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    const plan = SUBSCRIPTION_PLANS.find((p) => p.tier === parsed.data.tier);
    if (!plan) {
      return NextResponse.json({ error: 'Plan introuvable' }, { status: 404 });
    }

    // Check if already subscribed
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (existingSub?.status === 'ACTIVE') {
      return NextResponse.json(
        { error: 'Vous avez déjà un abonnement actif. Annulez-le d\'abord pour changer.' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createSubscriptionCheckout({
      userId: session.user.id,
      email: session.user.email,
      tier: plan.tier,
      priceAmount: plan.price,
      successUrl: `${appUrl}/success?type=subscription&tier=${plan.tier}`,
      cancelUrl: `${appUrl}/cancel?type=subscription`,
    });

    logger.info('Subscription checkout created', {
      userId: session.user.id,
      tier: plan.tier,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    logger.error('Subscription error', { error: String(error) });
    if (error?.message?.includes('Invalid API Key')) {
      return NextResponse.json({ error: 'Clé d\'API Stripe non configurée (.env)' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
