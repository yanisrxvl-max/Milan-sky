import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { chatMessageSchema } from '@/lib/validations';
import { chatLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { sanitizeForDB } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { openai, MILAN_SYSTEM_PROMPT } from '@/lib/openai';

const CHAT_LIMITS: Record<string, number> = {
  VOYEUR: 10,
  INITIE: 999,
  PRIVILEGE: 999,
  SKYCLUB: 999,
};

// Fallback replies if OpenAI is unavailable or API key not set
const FALLBACK_REPLIES = [
  "Merci pour ton message 💫 Je prends note...",
  "Intéressant... j'aime ta curiosité 🖤",
  "Tu sais que t'es dans le bon univers ici ✨",
  "Je vois que tu veux aller plus loin... J'adore ça 🔥",
  "Ton énergie est incroyable, continue comme ça 💛",
  "J'ai quelque chose de spécial en préparation pour les membres comme toi...",
  "Patience... les meilleurs contenus arrivent bientôt 🌙",
  "Tu fais partie des vrais. Ça se voit 👑",
];

// Get chat history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    let conversation = await prisma.conversation.findUnique({
      where: { userId: session.user.id }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { userId: session.user.id }
      });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
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
      conversationId: conversation.id
    });
  } catch (error) {
    logger.error('Chat fetch error', { error: String(error) });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Send message
export async function POST(request: NextRequest) {
  console.log('--- Chat Request Received ---');

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

    let conversation = await prisma.conversation.findUnique({
      where: { userId: session.user.id }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { userId: session.user.id }
      });
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
        conversationId: conversation.id,
        content: sanitizeForDB(parsed.data.content),
        sender: 'USER',
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    });

    // Generate Milan's reply
    let replyText: string;

    if (openai) {
      try {
        // Fetch active personality items
        const userWithMuses = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            activeMuseId: true,
            activeElixirId: true,
            activeMoodPackId: true,
            elixirExpiresAt: true
          }
        });

        let systemPrompt = MILAN_SYSTEM_PROMPT;

        if (userWithMuses) {
          // Check Elixir expiration
          const elixirActive = userWithMuses.activeElixirId &&
            (!userWithMuses.elixirExpiresAt || new Date() < userWithMuses.elixirExpiresAt);

          const activeIds = [
            userWithMuses.activeMuseId,
            elixirActive ? userWithMuses.activeElixirId : null,
            userWithMuses.activeMoodPackId
          ].filter(Boolean) as string[];

          if (activeIds.length > 0) {
            const activeItems = await prisma.muse.findMany({
              where: { id: { in: activeIds } }
            });

            const personalityInstructions = activeItems.map(item => `INSTRUCTION [${item.category}]: ${item.prompt}`).join('\n\n');
            systemPrompt += `\n\nACTIONS DE PERSONNALITÉ ACTIVES :\n${personalityInstructions}\n\nIMPORTANT : Priorise ces instructions de personnalité au-dessus du ton de base si elles se contredisent légèrement.`;
          }
        }

        // Fetch recent conversation history for context (last 20 messages)
        const recentMessages = await prisma.message.findMany({
          where: { conversationId: conversation.id },
          orderBy: { createdAt: 'desc' },
          take: 20,
        });

        const conversationHistory = recentMessages
          .reverse()
          .map((msg) => ({
            role: msg.sender === 'USER' ? 'user' as const : 'assistant' as const,
            content: msg.content || '',
          }));

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
          ],
          max_tokens: 300,
          temperature: 0.85,
        });

        replyText = completion.choices[0]?.message?.content || FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
      } catch (aiError) {
        console.error('CRITICAL: OpenAI API Error:', aiError);
        logger.error('OpenAI API error, falling back to static replies', {
          error: String(aiError),
          message: aiError instanceof Error ? aiError.message : 'Unknown error'
        });
        replyText = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
      }
    } else {
      // No API key configured — use fallback replies
      replyText = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
    }

    const milanMessage = await prisma.message.create({
      data: {
        userId: session.user.id,
        conversationId: conversation.id,
        content: replyText,
        sender: 'MILAN',
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
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
