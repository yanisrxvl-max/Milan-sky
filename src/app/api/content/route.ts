import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { SubscriptionTier } from '@prisma/client';

const TIER_LEVELS = {
    VOYEUR: 1,
    INITIE: 2,
    PRIVILEGE: 3,
    SKYCLUB: 4,
};

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const userId = session.user.id;
        const role = session.user.role;

        // Fetch user's active subscription
        const userSub = await prisma.subscription.findUnique({
            where: { userId },
        });

        const activeTier = userSub?.status === 'ACTIVE' ? userSub.tier : null;
        const userTierLevel = activeTier ? TIER_LEVELS[activeTier as keyof typeof TIER_LEVELS] : 0;

        // Fetch user's direct purchases
        const purchases = await prisma.purchase.findMany({
            where: { userId },
            select: { contentId: true }
        });
        const purchasedContentIds = new Set(purchases.map(p => p.contentId));

        // Fetch all active content
        const contents = await prisma.content.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        // Determine access for each content
        const processedContents = contents.map(content => {
            const contentTierLevel = TIER_LEVELS[content.tier as keyof typeof TIER_LEVELS];

            // Access granted if user is ADMIN, or has equal/higher tier subscription, or has directly purchased it
            const hasTierAccess = userTierLevel >= contentTierLevel;
            const isPurchased = purchasedContentIds.has(content.id);
            const isUnlocked = role === 'ADMIN' || hasTierAccess || isPurchased;

            return {
                id: content.id,
                title: content.title,
                description: content.description,
                type: content.type,
                tier: content.tier,
                price: content.price,
                imageUrl: content.imageUrl,
                // Only return actual media URL if unlocked
                mediaUrl: isUnlocked ? content.mediaUrl : null,
                isUnlocked,
                unlockReason: role === 'ADMIN' ? 'ADMIN' : hasTierAccess ? 'SUBSCRIPTION' : isPurchased ? 'PURCHASED' : null,
                createdAt: content.createdAt,
            };
        });

        return NextResponse.json({ contents: processedContents });

    } catch (error) {
        logger.error('API /content GET error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur Serveur' }, { status: 500 });
    }
}
