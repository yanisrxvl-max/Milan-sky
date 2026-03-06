import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { MISSIONS } from '@/lib/missions';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await req.json();
        const { missionKey } = body;

        if (!missionKey) {
            return NextResponse.json({ error: 'missionKey requis' }, { status: 400 });
        }

        const mission = MISSIONS.find(m => m.key === missionKey);
        if (!mission) {
            return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });
        }

        const userId = session.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check if already completed today
        const existing = await prisma.missionCompletion.findFirst({
            where: {
                userId,
                missionKey,
                completedAt: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'Mission déjà complétée aujourd\'hui' }, { status: 400 });
        }

        // Process completion and reward
        await prisma.$transaction(async (tx) => {
            await tx.missionCompletion.create({
                data: {
                    userId,
                    missionKey,
                    reward: mission.reward,
                }
            });

            await tx.skyCoinsBalance.upsert({
                where: { userId },
                create: { userId, balance: mission.reward },
                update: { balance: { increment: mission.reward } }
            });

            await tx.user.update({
                where: { id: userId },
                data: { totalSkyCoinsEarned: { increment: mission.reward } },
            });

            await tx.transaction.create({
                data: {
                    userId,
                    type: 'MISSION_REWARD',
                    amount: mission.reward,
                    description: `Mission complétée : ${mission.title}`,
                }
            });
        });

        logger.info('Mission completed', { userId, missionKey, reward: mission.reward });

        return NextResponse.json({ success: true, reward: mission.reward });

    } catch (error) {
        logger.error('Mission complete error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
