import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const pass = searchParams.get('pass');

        // Default Passkey: Change this in production or use an environment variable!
        const SECRET_REVEAL = process.env.GODMODE_PASSWORD || 'MILANSKY_MASTER_KEY_2026';

        if (pass !== SECRET_REVEAL) {
            return NextResponse.json({ error: 'Access Denied: The sanctuary remains closed.' }, { status: 403 });
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Tu dois te connecter avec un compte gratuit d\'abord.' }, { status: 401 });
        }

        // ACTIVATE GOD MODE
        await prisma.$transaction(async (tx) => {
            // 1. Upgrade User Role to ADMIN
            await tx.user.update({
                where: { id: session.user.id },
                data: { role: 'ADMIN' }
            });

            // 2. Inject 999,999 SkyCoins
            await tx.skyCoinsBalance.upsert({
                where: { userId: session.user.id },
                update: { balance: 999999 },
                create: { userId: session.user.id, balance: 999999 }
            });

            // 3. Optional: Give an active subscription of SKYCLUB (to bypass any frontend UI checks)
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 10);

            await tx.subscription.upsert({
                where: { userId: session.user.id },
                update: {
                    tier: 'SKYCLUB',
                    status: 'ACTIVE',
                    currentPeriodEnd: futureDate,
                },
                create: {
                    userId: session.user.id,
                    tier: 'SKYCLUB',
                    status: 'ACTIVE',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: futureDate,
                }
            });
        });

        logger.info('GOD MODE ACTIVATED', { userId: session.user.id });

        // Note: Re-logging might be required to update the session token's role, but middleware will pick it up on next login.
        // However, the database is updated.

        return NextResponse.json({
            success: true,
            message: 'GOD MODE ACTIVÉ. Bienvenue, Maître. Déconnecte-toi et reconnecte-toi pour rafraîchir ta session ADMIN.',
            skyCoins: 999999,
            tier: 'SKYCLUB',
            role: 'ADMIN'
        });

    } catch (error) {
        logger.error('GodMode activation error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur Serveur' }, { status: 500 });
    }
}
