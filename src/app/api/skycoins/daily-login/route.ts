import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

// VOYEUR: x1, INITIE: x2, PRIVILEGE: x3, SKYCLUB: x5
const SUBSCRIPTION_MULTIPLIERS: Record<string, number> = {
    VOYEUR: 1,
    INITIE: 2,
    PRIVILEGE: 3,
    SKYCLUB: 5,
};

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const userId = session.user.id;

        // Get current date (midnight UTC)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // 1. Check if already claimed today
        const existingClaim = await prisma.dailyLogin.findUnique({
            where: {
                userId_date: {
                    userId: userId,
                    date: today,
                },
            },
        });

        if (existingClaim) {
            return NextResponse.json(
                { error: 'Bonus déjà réclamé aujourd\'hui' },
                { status: 400 }
            );
        }

        // 2. Determine multiplier based on active subscription
        let multiplier = 1;
        const userSub = await prisma.subscription.findUnique({
            where: { userId },
            select: { tier: true, status: true },
        });

        if (userSub && userSub.status === 'ACTIVE') {
            multiplier = SUBSCRIPTION_MULTIPLIERS[userSub.tier] || 1;
        }

        const baseBonus = 2; // Fixed base bonus
        const finalBonus = baseBonus * multiplier;

        // 3. Execute transaction securely
        await prisma.$transaction(async (tx) => {
            // Create login record
            await tx.dailyLogin.create({
                data: {
                    userId,
                    date: today,
                    bonus: finalBonus,
                },
            });

            // Update balances
            await tx.skyCoinsBalance.upsert({
                where: { userId },
                create: { userId, balance: finalBonus },
                update: { balance: { increment: finalBonus } },
            });

            // Update total earned for leaderboard
            await tx.user.update({
                where: { id: userId },
                data: { totalSkyCoinsEarned: { increment: finalBonus } },
            });

            // Log transaction
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'LOGIN_BONUS',
                    amount: finalBonus,
                    description: `Bonus de connexion quotidienne (Multiplicateur x${multiplier})`,
                },
            });
        });

        logger.info('Daily login bonus claimed', { userId, bonus: finalBonus, multiplier });

        return NextResponse.json({
            success: true,
            bonus: finalBonus,
            multiplier
        });

    } catch (error) {
        logger.error('Daily login error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
