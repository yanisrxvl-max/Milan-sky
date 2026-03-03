import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = apiLimiter(ip);
    if (!success) return rateLimitResponse();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { contentId } = await request.json();

    if (!contentId || typeof contentId !== 'string') {
      return NextResponse.json({ error: 'Content ID requis' }, { status: 400 });
    }

    // Check if already purchased
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_contentId: { userId: session.user.id, contentId },
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: 'Contenu déjà débloqué' }, { status: 400 });
    }

    // Get content
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 });
    }

    // Check balance
    const balance = await prisma.skyCoinsBalance.findUnique({
      where: { userId: session.user.id },
    });

    if (!balance || balance.balance < content.price) {
      return NextResponse.json(
        { error: 'Solde SkyCoins insuffisant' },
        { status: 400 }
      );
    }

    // Atomic transaction: deduct coins and create purchase
    await prisma.$transaction([
      prisma.skyCoinsBalance.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: content.price } },
      }),
      prisma.purchase.create({
        data: {
          userId: session.user.id,
          contentId: content.id,
          price: content.price,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: 'SKYCOINS_SPEND',
          amount: -content.price,
          description: `Déblocage: ${content.title}`,
        },
      }),
    ]);

    logger.info('Content unlocked', {
      userId: session.user.id,
      contentId,
      price: content.price,
    });

    return NextResponse.json({
      message: 'Contenu débloqué avec succès!',
      newBalance: balance.balance - content.price,
    });
  } catch (error) {
    logger.error('Content unlock error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
