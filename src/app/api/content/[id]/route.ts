import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

const TIER_LEVELS = {
    VOYEUR: 1,
    INITIE: 2,
    PRIVILEGE: 3,
    SKYCLUB: 4,
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const userId = session.user.id;
        const role = session.user.role;
        const contentId = params.id;

        const content = await prisma.content.findUnique({
            where: { id: contentId, isActive: true }
        });

        if (!content) {
            return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 });
        }

        // Admin bypass
        if (role === 'ADMIN') {
            return NextResponse.json({ content });
        }

        // Sub Check
        const userSub = await prisma.subscription.findUnique({ where: { userId } });
        const activeTier = userSub?.status === 'ACTIVE' ? userSub.tier : null;
        const userTierLevel = activeTier ? TIER_LEVELS[activeTier] : 0;
        const contentTierLevel = TIER_LEVELS[content.tier as keyof typeof TIER_LEVELS];

        // Purchase Check
        const purchase = await prisma.purchase.findUnique({
            where: { userId_contentId: { userId, contentId } }
        });

        const isUnlocked = userTierLevel >= contentTierLevel || !!purchase;

        if (!isUnlocked) {
            return NextResponse.json({ error: 'Accès refusé. Achetez ce contenu ou mettez votre abonnement à niveau.' }, { status: 403 });
        }

        return NextResponse.json({ content });
    } catch (error) {
        logger.error('API /content/[id] GET error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur Serveur' }, { status: 500 });
    }
}
