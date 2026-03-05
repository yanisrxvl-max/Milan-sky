
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

        const { museId, category, action } = await request.json();
        const userId = session.user.id;

        if (action === 'DEACTIVATE') {
            const updateData: any = {};
            if (category === 'MUSE') updateData.activeMuseId = null;
            if (category === 'ELIXIR') updateData.activeElixirId = null;
            if (category === 'MOOD_PACK') updateData.activeMoodPackId = null;

            await prisma.user.update({
                where: { id: userId },
                data: updateData
            });
            return NextResponse.json({ success: true });
        }

        // Check if owned (only for MUSE/MOOD_PACK, ELIXIRS/RITUALS are usually one-time/owned too for consistency)
        const purchase = await prisma.musePurchase.findUnique({
            where: { userId_museId: { userId, museId } }
        });

        if (!purchase) {
            return NextResponse.json({ error: 'Vous devez d\'abord acheter cet item' }, { status: 403 });
        }

        const muse = await prisma.muse.findUnique({ where: { id: museId } });
        if (!muse) return NextResponse.json({ error: 'Item introuvable' }, { status: 404 });

        const updateData: any = {};
        if (muse.category === 'MUSE') updateData.activeMuseId = museId;
        if (muse.category === 'ELIXIR') {
            updateData.activeElixirId = museId;
            // Elixir lasts for 2 hours for example
            updateData.elixirExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
        }
        if (muse.category === 'MOOD_PACK') updateData.activeMoodPackId = museId;

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('API /muses/activate POST error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
