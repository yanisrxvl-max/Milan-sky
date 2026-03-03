import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { chatMessageSchema } from '@/lib/validations';
import { chatLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { sanitizeForDB } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

const CHAT_LIMITS: Record<string, number> = {
  BASIC: 10,
  ELITE: 999,
  ICON: 999,
};

const MILAN_REPLIES = [
  "Merci pour ton message 💫 Je prends note...",
  "Intéressant... j'aime ta curiosité 🖤",
  "Tu sais que t'es dans le bon univers ici ✨",
  "Je vois que tu veux aller plus loin... J'adore ça 🔥",
  "Ton énergie est incroyable, continue comme ça 💛",
  "J'ai quelque chose de spécial en préparation pour les membres comme toi...",
  "Patience... les meilleurs contenus arrivent bientôt 🌙",
  "Tu fais partie des vrais. Ça se voit 👑",
  "Merci d'être là. Ça compte plus que tu ne le penses 🖤",
  "Si tu veux du contenu encore plus exclusif, regarde les packs privés 🔐",
  "J'apprécie ta fidélité. Les meilleurs drops sont pour bientôt ✨",
  "Tu veux savoir un secret ? Les ICON ont accès à des choses que personne d'autre ne voit 🤫",
];

// Get chat history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    // Get today's message count for the user
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await prisma.message.count({
      where: {
        userId: session.user.id,
        sender: 'USER',
        createdAt: { gte: today },
      },
    });

    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const limit = sub ? CHAT_LIMITS[sub.tier] || 10 : 5;

    return NextResponse.json({
      messages,
      todayCount,
      dailyLimit: limit,
      remaining: Math.max(0, limit - todayCount),
    });
  } catch (error) {
    logger.error('Chat fetch error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Send message
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = chatLimiter(ip);
    if (!success) return rateLimitResponse();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = chatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await prisma.message.count({
      where: {
        userId: session.user.id,
        sender: 'USER',
        createdAt: { gte: today },
      },
    });

    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const limit = sub ? CHAT_LIMITS[sub.tier] || 10 : 5;

    if (todayCount >= limit) {
      return NextResponse.json(
        { error: 'Limite de messages quotidienne atteinte. Upgradez votre abonnement pour plus.' },
        { status: 429 }
      );
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        userId: session.user.id,
        content: sanitizeForDB(parsed.data.content),
        sender: 'USER',
      },
    });

    // Generate and save Milan's reply
    const replyText = MILAN_REPLIES[Math.floor(Math.random() * MILAN_REPLIES.length)];

    const milanMessage = await prisma.message.create({
      data: {
        userId: session.user.id,
        content: replyText,
        sender: 'MILAN',
      },
    });

    return NextResponse.json({
      userMessage,
      milanMessage,
      remaining: Math.max(0, limit - todayCount - 1),
    });
  } catch (error) {
    logger.error('Chat message error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
