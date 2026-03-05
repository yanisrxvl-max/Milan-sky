import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { type, targetId, amount, method, proofImageUrl } = body;

        if (!type || !targetId || !amount || !method) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const manualPayment = await prisma.manualPaymentRequest.create({
            data: {
                userId: session.user.id,
                type: type as 'SUBSCRIPTION' | 'SKYCOINS',
                targetId,
                amount: parseFloat(amount),
                method,
                proofImageUrl,
                status: 'PENDING',
            },
        });

        return NextResponse.json(manualPayment);
    } catch (error) {
        console.error('[MANUAL_PAYMENT_SUBMIT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
