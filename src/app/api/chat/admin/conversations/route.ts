import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // 'vip', 'unread', 'top_spenders'

        let where: any = {};
        if (filter === 'vip') {
            where.isPriority = true;
        } else if (filter === 'unread') {
            where.unreadCount = { gt: 0 };
        }

        const conversations = await prisma.conversation.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatarUrl: true,
                        totalSpentInChat: true,
                        subscription: { select: { tier: true } },
                    },
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                }
            },
            orderBy: { lastMessageAt: 'desc' },
        });

        return NextResponse.json({ conversations });
    } catch (error) {
        logger.error('Admin conversations fetch error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { id, unreadCount, isPriority, status } = body;

        const conversation = await prisma.conversation.update({
            where: { id },
            data: {
                unreadCount: unreadCount !== undefined ? unreadCount : undefined,
                isPriority: isPriority !== undefined ? isPriority : undefined,
                status: status !== undefined ? status : undefined,
            },
        });

        return NextResponse.json({ conversation });
    } catch (error) {
        logger.error('Admin conversation update error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
