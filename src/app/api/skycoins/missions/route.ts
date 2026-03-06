import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { MISSIONS } from '@/lib/missions';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Only fetch completions if logged in, otherwise return available missions
        let completions: string[] = [];

        if (session?.user?.id) {
            // Get today's start and end
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            const tomorow = new Date(today);
            tomorow.setDate(tomorow.getDate() + 1);

            const completed = await prisma.missionCompletion.findMany({
                where: {
                    userId: session.user.id,
                    completedAt: {
                        gte: today,
                        lt: tomorow
                    }
                },
                select: {
                    missionKey: true
                }
            });
            completions = completed.map(c => c.missionKey);
        }

        const missionsWithStatus = MISSIONS.map(m => ({
            ...m,
            completed: completions.includes(m.key)
        }));

        return NextResponse.json(missionsWithStatus);
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
