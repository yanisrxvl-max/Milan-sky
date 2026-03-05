import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

// GET all private requests (admin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const requests = await prisma.privateRequest.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { email: true, name: true }
                }
            }
        });

        return NextResponse.json({ requests });
    } catch (error) {
        logger.error('Admin requests fetch error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// PATCH update request status (admin only)
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { requestId, status, adminNotes } = await request.json();

        if (!requestId || !status) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        const validStatuses = ['PENDING', 'VALIDATED', 'PAID', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        const updated = await prisma.privateRequest.update({
            where: { id: requestId },
            data: {
                status,
                ...(adminNotes !== undefined && { adminNotes }),
            }
        });

        logger.info('Admin updated private request', { requestId, status });

        return NextResponse.json({ request: updated });
    } catch (error) {
        logger.error('Admin request update error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
