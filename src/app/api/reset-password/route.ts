import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import prisma from '@/lib/db';
import { resetPasswordSchema, newPasswordSchema } from '@/lib/validations';
import { sendResetPasswordEmail } from '@/lib/email';
import { authLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

// Request reset
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = authLimiter(ip);
    if (!success) return rateLimitResponse();

    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'Si un compte existe avec cette adresse, un email de réinitialisation a été envoyé.',
      });
    }

    const resetToken = uuid();
    const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    try {
      await sendResetPasswordEmail(user.email, resetToken);
    } catch (emailError) {
      logger.error('Failed to send reset email', { error: String(emailError) });
    }

    return NextResponse.json({
      message: 'Si un compte existe avec cette adresse, un email de réinitialisation a été envoyé.',
    });
  } catch (error) {
    logger.error('Reset password request error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Set new password
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    logger.info('Password reset completed', { userId: user.id });

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    logger.error('Reset password error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
