import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { messageId } = await request.json();

        const message = await prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message || !message.isLocked || message.isPaid) {
            return NextResponse.json({ error: 'Message non verrouillé ou déjà payé' }, { status: 400 });
        }

        const userBalance = await prisma.skyCoinsBalance.findUnique({
            where: { userId: session.user.id },
        });

        if (!userBalance || userBalance.balance < message.price) {
            return NextResponse.json({ error: 'Solde SkyCoins insuffisant' }, { status: 400 });
        }

        // Atomic transaction: deduct coins and mark message as paid
        const [balanceUpdate, paidMessage] = await prisma.$transaction([
            prisma.skyCoinsBalance.update({
                where: { userId: session.user.id },
                data: { balance: { decrement: message.price } },
            }),
            prisma.message.update({
                where: { id: messageId },
                data: { isPaid: true },
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: { totalSpentInChat: { increment: message.price } },
            }),
            prisma.transaction.create({
                data: {
                    userId: session.user.id,
                    type: 'SKYCOINS_SPEND',
                    amount: message.price,
                    description: `Unlock message content (${messageId})`,
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            message: paidMessage,
            newBalance: balanceUpdate.balance
        });

    } catch (error) {
        logger.error('Message unlock error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
