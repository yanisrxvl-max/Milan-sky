import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { privateRequestSchema } from '@/lib/validations';
import { sendAdminNotification } from '@/lib/email';
import { apiLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { sanitizeForDB } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

function generateOrderNumber(): string {
  const prefix = 'MS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Get user's private requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const requests = await prisma.privateRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    logger.error('Private requests fetch error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Create private request
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = apiLimiter(ip);
    if (!success) return rateLimitResponse();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = privateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const privateRequest = await prisma.privateRequest.create({
      data: {
        userId: session.user.id,
        orderNumber,
        type: parsed.data.type,
        description: sanitizeForDB(parsed.data.description),
        budget: parsed.data.budget,
      },
    });

    // Notify admin
    try {
      await sendAdminNotification(
        `Nouvelle commande privée ${orderNumber}`,
        `
          <p><strong>Commande:</strong> ${orderNumber}</p>
          <p><strong>Type:</strong> ${parsed.data.type}</p>
          <p><strong>Budget:</strong> ${parsed.data.budget ? `${parsed.data.budget}€` : 'Non spécifié'}</p>
          <p><strong>Description:</strong> ${sanitizeForDB(parsed.data.description)}</p>
          <p><strong>Utilisateur:</strong> ${session.user.email}</p>
        `
      );
    } catch (emailError) {
      logger.error('Admin notification failed', { error: String(emailError) });
    }

    logger.info('Private request created', {
      userId: session.user.id,
      orderNumber,
    });

    return NextResponse.json({
      request: {
        id: privateRequest.id,
        orderNumber: privateRequest.orderNumber,
        type: privateRequest.type,
        status: privateRequest.status,
        createdAt: privateRequest.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    logger.error('Private request creation error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
