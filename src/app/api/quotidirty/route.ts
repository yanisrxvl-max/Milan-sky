import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const now = new Date();

        // Find the active Quotidirty drop
        const activeDrop = await prisma.quotidirty.findFirst({
            where: {
                isActive: true,
                releaseTime: { lte: now },
                expireTime: { gte: now },
            },
            orderBy: { releaseTime: 'desc' },
        });

        if (!activeDrop) {
            return NextResponse.json({ drop: null });
        }

        // Check if user has purchased this drop
        let isPurchased = false;
        if (session?.user?.id) {
            const purchase = await prisma.quotidirtyPurchase.findUnique({
                where: {
                    userId_quotidirtyId: {
                        userId: session.user.id,
                        quotidirtyId: activeDrop.id,
                    },
                },
            });
            isPurchased = !!purchase;
        }

        return NextResponse.json({
            drop: {
                ...activeDrop,
                isPurchased,
            },
        });
    } catch (error) {
        console.error('Error fetching Quotidirty:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
