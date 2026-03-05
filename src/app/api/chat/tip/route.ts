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

        const { amount } = await request.json();
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
        }

        const userBalance = await prisma.skyCoinsBalance.findUnique({
            where: { userId: session.user.id },
        });

        if (!userBalance || userBalance.balance < amount) {
            return NextResponse.json({ error: 'Solde SkyCoins insuffisant' }, { status: 400 });
        }

        let conversation = await prisma.conversation.findUnique({
            where: { userId: session.user.id }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: { userId: session.user.id }
            });
        }

        // Atomic transaction: tip and log transaction
        const [balanceUpdate, tipMessage] = await prisma.$transaction([
            prisma.skyCoinsBalance.update({
                where: { userId: session.user.id },
                data: { balance: { decrement: amount } },
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: { totalSpentInChat: { increment: amount } },
            }),
            prisma.message.create({
                data: {
                    userId: session.user.id,
                    conversationId: conversation.id,
                    content: `Vient d'envoyer un pourboire de ${amount} SkyCoins !`,
                    sender: 'USER',
                    messageType: 'TIP',
                    price: amount,
                    isPaid: true,
                    isAI: false,
                },
            }),
            prisma.transaction.create({
                data: {
                    userId: session.user.id,
                    type: 'SKYCOINS_SPEND',
                    amount: amount,
                    description: `Tip in chat`,
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            message: tipMessage,
            newBalance: balanceUpdate.balance
        });

    } catch (error) {
        logger.error('Tip error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
