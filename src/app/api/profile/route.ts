import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { profileUpdateSchema } from '@/lib/validations';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        skyCoinsBalance: true,
        purchases: { include: { content: true }, orderBy: { createdAt: 'desc' } },
        privateRequests: { orderBy: { createdAt: 'desc' } },
        transactions: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Calculate Fan Rank
    let fanRankBadge = 'Fan Découverte';
    const totalUsers = await prisma.user.count({
      where: { totalSkyCoinsEarned: { gt: 0 } }
    });

    if (totalUsers > 0 && user.totalSkyCoinsEarned > 0) {
      const higherCount = await prisma.user.count({
        where: { totalSkyCoinsEarned: { gt: user.totalSkyCoinsEarned } }
      });
      const userRankValue = higherCount + 1;
      const percentile = (userRankValue / totalUsers) * 100;

      if (percentile <= 1) fanRankBadge = 'Divine Fan';
      else if (percentile <= 10) fanRankBadge = 'Sky Royalty';
      else if (percentile <= 25) fanRankBadge = 'Elite Circle';
      else if (percentile <= 50) fanRankBadge = 'Inner Circle';
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      fanRank: fanRankBadge,
      subscription: user.subscription
        ? {
          tier: user.subscription.tier,
          status: user.subscription.status,
          currentPeriodEnd: user.subscription.currentPeriodEnd,
        }
        : null,
      skyCoinsBalance: user.skyCoinsBalance?.balance ?? 0,
      skyPoints: user.skyPoints ?? 0,
      proximityGauge: user.proximityGauge ?? 0,
      purchases: user.purchases.map((p) => ({
        id: p.id,
        contentTitle: p.content.title,
        contentType: p.content.type,
        price: p.price,
        createdAt: p.createdAt,
      })),
      privateRequests: user.privateRequests.map((r) => ({
        id: r.id,
        orderNumber: r.orderNumber,
        type: r.type,
        status: r.status,
        createdAt: r.createdAt,
      })),
      transactions: user.transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        euroAmount: t.euroAmount,
        description: t.description,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    logger.error('Profile fetch error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    logger.error('Profile update error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
