import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Fetch top 50 users globally based on totalSkyCoinsEarned
        const topFans = await prisma.user.findMany({
            where: {
                totalSkyCoinsEarned: { gt: 0 } // Only show people with > 0 SC earned
            },
            orderBy: {
                totalSkyCoinsEarned: 'desc'
            },
            take: 50,
            select: {
                id: true,
                name: true,
                avatarUrl: true,
                totalSkyCoinsEarned: true
            }
        });

        // Anonymize the response a bit for public viewing
        const publicLeaderboard = topFans.map((fan, index) => ({
            rank: index + 1,
            name: fan.name || `Fan Anonyme #${fan.id.slice(-4)}`,
            avatarUrl: fan.avatarUrl,
            score: fan.totalSkyCoinsEarned,
            isCurrentUser: session?.user?.id === fan.id
        }));

        // Find the current user's exact ranking
        let userRank = null;
        let rankBadge = 'Fan Découverte';
        let userScore = 0;

        if (session?.user?.id) {
            const currentUserData = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { totalSkyCoinsEarned: true }
            });

            if (currentUserData) {
                userScore = currentUserData.totalSkyCoinsEarned;

                // Count how many users have strictly more SC (to get the rank index)
                const higherCount = await prisma.user.count({
                    where: {
                        totalSkyCoinsEarned: {
                            gt: userScore
                        }
                    }
                });

                const totalUsers = await prisma.user.count({
                    where: { totalSkyCoinsEarned: { gt: 0 } }
                });

                userRank = higherCount + 1; // 1-indexed

                if (totalUsers > 0) {
                    const percentile = (userRank / totalUsers) * 100;
                    if (percentile <= 1) rankBadge = 'Divine Fan';
                    else if (percentile <= 10) rankBadge = 'Sky Royalty';
                    else if (percentile <= 25) rankBadge = 'Elite Circle';
                    else if (percentile <= 50) rankBadge = 'Inner Circle';
                }
            }
        }

        return NextResponse.json({
            leaderboard: publicLeaderboard,
            userCurrentContext: session?.user?.id ? {
                rank: userRank,
                badge: rankBadge,
                score: userScore
            } : null
        });

    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
