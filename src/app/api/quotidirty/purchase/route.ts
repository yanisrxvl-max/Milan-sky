import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { dropId } = await req.json();

        const drop = await prisma.quotidirty.findUnique({
            where: { id: dropId },
        });

        if (!drop || !drop.isActive) {
            return NextResponse.json({ error: 'Drop not found or expired' }, { status: 404 });
        }

        // Check balance
        const userBalance = await prisma.skyCoinsBalance.findUnique({
            where: { userId: session.user.id },
        });

        if (!userBalance || userBalance.balance < drop.price) {
            return NextResponse.json({ error: 'Insufficient SkyCoins', missing: drop.price - (userBalance?.balance || 0) }, { status: 402 });
        }

        // Transaction
        await prisma.$transaction([
            prisma.skyCoinsBalance.update({
                where: { userId: session.user.id },
                data: { balance: { decrement: drop.price } },
            }),
            prisma.quotidirtyPurchase.create({
                data: {
                    userId: session.user.id,
                    quotidirtyId: drop.id,
                },
            }),
            prisma.transaction.create({
                data: {
                    userId: session.user.id,
                    type: 'SKYCOINS_SPEND',
                    amount: drop.price,
                    description: `Unlock Quotidirty Drop: ${drop.title}`,
                },
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error purchasing Quotidirty:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
