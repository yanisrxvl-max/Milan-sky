import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                createdAt: true,
                ageVerified: true,
                birthDate: true,
                role: true,
                skyCoinsBalance: {
                    select: {
                        balance: true
                    }
                },
                subscription: {
                    select: {
                        tier: true,
                        status: true,
                        currentPeriodEnd: true
                    }
                },
                _count: {
                    select: {
                        purchases: true,
                        transactions: true
                    }
                },
                totalSkyCoinsEarned: true
            } as any,
            orderBy: { createdAt: 'desc' }
        });

        const formattedUsers = users.map((u: any) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            avatarUrl: u.avatarUrl,
            createdAt: u.createdAt,
            ageVerified: u.ageVerified,
            role: u.role,
            balance: u.skyCoinsBalance?.balance ?? 0,
            subscription: u.subscription,
            purchaseCount: u._count?.purchases ?? 0,
            totalEarned: u.totalSkyCoinsEarned
        }));

        return NextResponse.json({ users: formattedUsers });

    } catch (error) {
        logger.error('Admin users fetch error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
