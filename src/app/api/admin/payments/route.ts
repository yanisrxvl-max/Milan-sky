import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// GET: List all manual payment requests
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const requests = await prisma.manualPaymentRequest.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error('[ADMIN_PAYMENTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// PATCH: Validate or Reject a payment
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { requestId, status, adminNotes } = body;

        if (!requestId || !status) {
            return new NextResponse('Missing fields', { status: 400 });
        }

        const request = await prisma.manualPaymentRequest.findUnique({
            where: { id: requestId },
            include: { user: true }
        });

        if (!request) {
            return new NextResponse('Request not found', { status: 404 });
        }

        if (request.status !== 'PENDING') {
            return new NextResponse('Request already processed', { status: 400 });
        }

        // Start transaction to update request and credit user
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Update request status
            const updatedRequest = await tx.manualPaymentRequest.update({
                where: { id: requestId },
                data: { status, adminNotes },
            });

            if (status === 'VALIDATED') {
                // 2. Create Transaction record
                await tx.transaction.create({
                    data: {
                        userId: request.userId,
                        type: request.type === 'SKYCOINS' ? 'SKYCOINS_PURCHASE' : 'SUBSCRIPTION_PAYMENT',
                        amount: request.type === 'SKYCOINS' ? Math.floor(request.amount * 10) : 0, // Placeholder logic for SC
                        euroAmount: request.amount,
                        description: `Manual Payment (${request.method}) - Approved by Admin`,
                    },
                });

                // 3. Update SkyCoins Balance or Subscription
                if (request.type === 'SKYCOINS') {
                    // Find coins based on targetId roughly
                    let coinsToAdd = 0;
                    if (request.targetId.includes('100')) coinsToAdd = 100;
                    else if (request.targetId.includes('320')) coinsToAdd = 320;
                    else if (request.targetId.includes('900')) coinsToAdd = 900;
                    else if (request.targetId.includes('2400')) coinsToAdd = 2400;

                    await tx.skyCoinsBalance.upsert({
                        where: { userId: request.userId },
                        update: { balance: { increment: coinsToAdd } },
                        create: { userId: request.userId, balance: coinsToAdd },
                    });
                } else if (request.type === 'SUBSCRIPTION') {
                    await tx.subscription.upsert({
                        where: { userId: request.userId },
                        update: {
                            tier: request.targetId.toUpperCase() as any,
                            status: 'ACTIVE',
                            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                        },
                        create: {
                            userId: request.userId,
                            tier: request.targetId.toUpperCase() as any,
                            status: 'ACTIVE',
                            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        },
                    });
                }
            }

            return updatedRequest;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('[ADMIN_PAYMENTS_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
