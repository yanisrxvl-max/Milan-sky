import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('mode') || 'NOCTUA';

        const games = await prisma.game.findMany({
            where: {
                isActive: true,
                mode: mode as any
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ games });
    } catch (error) {
        logger.error('API /games GET error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
