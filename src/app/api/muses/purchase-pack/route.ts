import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

const NOCTUA_PACK_PRICE = 600;  // 7 Muses Nuit
const LUMINA_PACK_PRICE = 200;  // 5 Muses Jour

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const userId = session.user.id;
        const { mode } = await req.json().catch(() => ({ mode: 'NOCTUA' }));
        const targetMode = mode === 'LUMINA' ? 'LUMINA' : 'NOCTUA';
        const PACK_PRICE = targetMode === 'LUMINA' ? LUMINA_PACK_PRICE : NOCTUA_PACK_PRICE;

        // Verify balance
        const wallet = await prisma.skyCoinsBalance.findUnique({
            where: { userId },
        });

        if (!wallet || wallet.balance < PACK_PRICE) {
            return NextResponse.json(
                { error: 'SkyCoins insuffisants pour ce Pack.' },
                { status: 400 }
            );
        }

        // Get Muses for the requested mode
        const allMuses = await prisma.muse.findMany({
            where: { category: 'MUSE', isActive: true, mode: targetMode as any },
        });

        if (allMuses.length === 0) {
            return NextResponse.json({ error: 'Aucune Muse disponible pour le pack.' }, { status: 400 });
        }

        // Process Purchase transaction
        await prisma.$transaction(async (tx) => {
            // 1. Deduct SkyCoins
            await tx.skyCoinsBalance.update({
                where: { userId },
                data: { balance: { decrement: PACK_PRICE } },
            });

            // 2. Record Transaction
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'SKYCOINS_SPEND',
                    amount: PACK_PRICE,
                    description: `Achat Pack All-Access Muses IA (${allMuses.length} Muses)`,
                },
            });

            // 3. Grant all muses (upsert to avoid errors if some already owned)
            for (const muse of allMuses) {
                await tx.musePurchase.upsert({
                    where: {
                        userId_museId: {
                            userId,
                            museId: muse.id
                        }
                    },
                    update: {},
                    create: {
                        userId,
                        museId: muse.id
                    }
                });
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Félicitations. Le Pack All-Access a été débloqué.'
        });

    } catch (error) {
        logger.error('Error purchasing Muses Pack', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
