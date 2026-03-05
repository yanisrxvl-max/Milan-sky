import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { apiLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request);
        const { success } = apiLimiter(ip);
        if (!success) return rateLimitResponse();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { contentId } = await request.json();
        if (!contentId) {
            return NextResponse.json({ error: 'Contenu manquant' }, { status: 400 });
        }

        const userId = session.user.id;

        // Check if content exists & fetch price
        const content = await prisma.content.findUnique({
            where: { id: contentId, isActive: true }
        });

        if (!content) {
            return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 });
        }

        // Check if already purchased
        const existingP = await prisma.purchase.findUnique({
            where: { userId_contentId: { userId, contentId } }
        });

        if (existingP) {
            return NextResponse.json({ error: 'Déjà acheté' }, { status: 400 });
        }

        // Check balance
        const userBalance = await prisma.skyCoinsBalance.findUnique({
            where: { userId }
        });

        if (!userBalance || userBalance.balance < content.price) {
            return NextResponse.json({ error: 'Fonds insuffisants' }, { status: 402 });
        }

        // Process Transaction Atomically
        await prisma.$transaction(async (tx) => {
            // 1. Deduct SkyCoins
            await tx.skyCoinsBalance.update({
                where: { userId },
                data: { balance: { decrement: content.price } }
            });

            // 2. Grant Access
            await tx.purchase.create({
                data: {
                    userId,
                    contentId,
                    price: content.price
                }
            });

            // 3. Log History
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'SKYCOINS_SPEND',
                    amount: content.price,
                    description: `Achat contenu: ${content.title}`
                }
            });
        });

        logger.info('Content unlocked via SkyCoins', { userId, contentId, price: content.price });

        return NextResponse.json({ success: true });

    } catch (error) {
        logger.error('Purchase error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur lors de l\'achat' }, { status: 500 });
    }
}
