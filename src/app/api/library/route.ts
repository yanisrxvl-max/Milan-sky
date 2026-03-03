import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

// Get library content
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const content = await prisma.content.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    let purchasedIds: string[] = [];
    if (session?.user?.id) {
      const purchases = await prisma.purchase.findMany({
        where: { userId: session.user.id },
        select: { contentId: true },
      });
      purchasedIds = purchases.map((p) => p.contentId);
    }

    return NextResponse.json({
      content: content.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        type: c.type,
        tier: c.tier,
        price: c.price,
        imageUrl: c.imageUrl,
        unlocked: purchasedIds.includes(c.id),
      })),
    });
  } catch (error) {
    logger.error('Library fetch error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
