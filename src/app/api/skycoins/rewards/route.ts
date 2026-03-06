import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { REWARDS } from '@/lib/rewards';

export async function GET() {
    return NextResponse.json(REWARDS);
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { rewardId } = await req.json();
        const reward = REWARDS.find(r => r.id === rewardId);

        if (!reward) {
            return NextResponse.json({ error: 'Récompense introuvable' }, { status: 404 });
        }

        const userId = session.user.id;

        // Check balance
        const balanceInfo = await prisma.skyCoinsBalance.findUnique({
            where: { userId }
        });

        if (!balanceInfo || balanceInfo.balance < reward.price) {
            return NextResponse.json({ error: 'Fonds SkyCoins insuffisants' }, { status: 400 });
        }

        // Process redemption
        await prisma.$transaction(async (tx) => {
            // Deduct balance
            await tx.skyCoinsBalance.update({
                where: { userId },
                data: { balance: { decrement: reward.price } }
            });

            // Log transaction
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'REWARD_REDEEM',
                    amount: -reward.price, // Negative amount for spending
                    description: `Réclamation : ${reward.title}`,
                }
            });

            // Admin manual fulfillment ticket
            await tx.privateRequest.create({
                data: {
                    userId,
                    orderNumber: `RWD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    type: 'CUSTOM',
                    description: `[RÉCOMPENSE SKYCOINS] L'utilisateur a réclamé : ${reward.title}. Coût : ${reward.price} SC.`,
                    budget: 0,
                    status: 'PENDING'
                }
            });
        });

        logger.info('Reward redeemed', { userId, rewardId, price: reward.price });
        return NextResponse.json({ success: true, reward });

    } catch (error) {
        logger.error('Reward redemption error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
