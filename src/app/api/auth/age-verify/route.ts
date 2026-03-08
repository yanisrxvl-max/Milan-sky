import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { ageVerificationSchema } from '@/lib/validations';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        const body = await request.json();
        const parsed = ageVerificationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
        }

        const birthDate = new Date(parsed.data.birthDate);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return NextResponse.json({
                error: 'Vous devez avoir au moins 18 ans pour accéder à ce mode.'
            }, { status: 403 });
        }

        // Update user in DB only if authenticated
        if (session?.user?.id) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    birthDate,
                    ageVerified: true,
                } as any,
            });

            logger.info('Authenticated user completed age verification', {
                userId: session.user.id,
                age
            });
        } else {
            logger.info('Guest user completed age verification', { age });
        }

        return NextResponse.json({ success: true, age, authenticated: !!session?.user?.id });
    } catch (error) {
        logger.error('Age verification error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
