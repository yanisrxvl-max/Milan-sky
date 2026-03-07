
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('mode') || 'NOCTUA';

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        // Get all active muses for the current mode
        const muses = await prisma.muse.findMany({
            where: {
                isActive: true,
                mode: mode as any // Cast to ThemeMode
            },
            orderBy: { price: 'asc' },
        });

        const purchasedIds = new Set<string>();
        let user = null;

        if (userId) {
            // Get user purchases
            const purchases = await prisma.musePurchase.findMany({
                where: { userId },
                select: { museId: true },
            });
            purchases.forEach(p => purchasedIds.add(p.museId));

            // Get user active states
            user = await prisma.user.findUnique({
                where: { id: userId },
                select: { activeMuseId: true, activeElixirId: true, activeMoodPackId: true, elixirExpiresAt: true }
            });
        }

        // Check if elixir is expired
        let activeElixirId = user?.activeElixirId;
        if (user?.elixirExpiresAt && new Date() > user.elixirExpiresAt) {
            activeElixirId = null;
        }

        const musesWithStatus = muses.map(muse => ({
            id: muse.id,
            title: muse.title,
            description: muse.description,
            price: muse.price,
            category: muse.category,
            imageUrl: muse.imageUrl,
            previewMessage: muse.previewMessage,
            isOwned: purchasedIds.has(muse.id),
            isActive: !!userId && (muse.id === user?.activeMuseId || muse.id === activeElixirId || muse.id === user?.activeMoodPackId),
            // Only reveal prompt if owned
            prompt: purchasedIds.has(muse.id) ? muse.prompt : undefined
        }));

        return NextResponse.json({ muses: musesWithStatus });
    } catch (error) {
        logger.error('API /muses GET error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { museId } = await request.json();
        const userId = session.user.id;

        const muse = await prisma.muse.findUnique({ where: { id: museId } });
        if (!muse) return NextResponse.json({ error: 'Muse introuvable' }, { status: 404 });

        // Check if already owned
        const existing = await prisma.musePurchase.findUnique({
            where: { userId_museId: { userId, museId } }
        });
        if (existing) return NextResponse.json({ error: 'Déjà possédé' }, { status: 400 });

        // Business Logic: Transaction
        const result = await prisma.$transaction(async (tx) => {
            const balance = await tx.skyCoinsBalance.findUnique({ where: { userId } });
            if (!balance || balance.balance < muse.price) {
                throw new Error('Solde SkyCoins insuffisant');
            }

            await tx.skyCoinsBalance.update({
                where: { userId },
                data: { balance: { decrement: muse.price } }
            });

            await tx.transaction.create({
                data: {
                    userId,
                    type: 'SKYCOINS_SPEND',
                    amount: muse.price,
                    description: `Achat Muse: ${muse.title}`,
                }
            });

            return await tx.musePurchase.create({
                data: { userId, museId }
            });
        });

        return NextResponse.json({ success: true, purchase: result });
    } catch (error) {
        logger.error('API /muses POST error', { error: String(error) });
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 });
    }
}
