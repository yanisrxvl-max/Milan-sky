import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { createCheckoutSession, SKYCOINS_PACKS } from '@/lib/stripe';
import { skycoinsPurchaseSchema } from '@/lib/validations';
import { apiLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

// Get balance
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const balance = await prisma.skyCoinsBalance.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ balance: balance?.balance ?? 0 });
  } catch (error) {
    logger.error('SkyCoins balance error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Purchase SkyCoins (create Stripe checkout)
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
    const parsed = skycoinsPurchaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Pack invalide' }, { status: 400 });
    }

    const pack = SKYCOINS_PACKS.find((p) => p.id === parsed.data.packId);
    if (!pack) {
      return NextResponse.json({ error: 'Pack introuvable' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      packId: pack.id,
      coins: pack.coins,
      price: pack.price,
      successUrl: `${appUrl}/success?type=skycoins&coins=${pack.coins}`,
      cancelUrl: `${appUrl}/cancel?type=skycoins`,
    });

    logger.info('SkyCoins checkout created', {
      userId: session.user.id,
      packId: pack.id,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    logger.error('SkyCoins purchase error', { error: String(error) });
    if (error?.message?.includes('Invalid API Key')) {
      return NextResponse.json({ error: 'Clé d\'API Stripe non configurée (.env)' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
