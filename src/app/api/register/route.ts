import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import prisma from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import { sendVerificationEmail, isEmailConfigured } from '@/lib/email';
import { authLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = authLimiter(ip);
    if (!success) return rateLimitResponse();

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const adminEmailEnv = process.env.ADMIN_EMAIL?.toLowerCase().trim();

    const assignedRole = adminEmailEnv && normalizedEmail === adminEmailEnv ? 'ADMIN' : 'USER';

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      // Don't reveal if email exists
      return NextResponse.json(
        { message: 'Si cette adresse est disponible, un email de vérification a été envoyé.' },
        { status: 200 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = uuid();

    // Check if email sending is properly configured (Resend or SMTP)
    const emailReady = isEmailConfigured();

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: assignedRole,
        name: name || null,
        verifyToken: emailReady ? verifyToken : null,
        emailVerified: emailReady ? null : new Date(), // Auto-verify if no SMTP
        skyCoinsBalance: {
          create: { balance: 0 },
        },
      },
    });

    // Only send verification email if SMTP is configured
    if (emailReady) {
      try {
        await sendVerificationEmail(normalizedEmail, verifyToken);
      } catch (emailError) {
        logger.error('Failed to send verification email', { email: normalizedEmail, error: String(emailError) });
        // Auto-verify if email fails to send
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date(), verifyToken: null },
        });
      }
    }

    logger.info('New user registered', { userId: user.id });

    return NextResponse.json(
      { message: 'Si cette adresse est disponible, un email de vérification a été envoyé.' },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Registration error', { error: String(error) });
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
