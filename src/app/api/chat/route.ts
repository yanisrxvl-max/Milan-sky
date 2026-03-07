import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { chatMessageSchema } from '@/lib/validations';
import { chatLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { sanitizeForDB } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { openai, MILAN_LUMINA_PROMPT, MILAN_NOCTUA_PROMPT } from '@/lib/openai';

const CHAT_LIMITS: Record<string, number> = {
  VOYEUR: 10,
  INITIE: 999,
  PRIVILEGE: 999,
  SKYCLUB: 999,
};

// Fallback replies if OpenAI is unavailable or API key not set
const FALLBACK_REPLIES_NIGHT = [
  "Merci pour ton message 💫 Je prends note...",
  "Intéressant... j'aime ta curiosité 🖤",
  "Tu sais que t'es dans le bon univers ici ✨",
  "Je vois que tu veux aller plus loin... J'adore ça 🔥",
  "Ton énergie est incroyable, continue comme ça 💛",
  "J'ai quelque chose de spécial en préparation pour les membres comme toi...",
  "Patience... les meilleurs contenus arrivent bientôt 🌙",
  "Tu fais partie des vrais. Ça se voit 👑",
];

const FALLBACK_REPLIES_DAY = [
  "Merci de partager ça avec moi 💛 C'est important ce que tu ressens.",
  "Je t'écoute. Prends ton temps pour mettre des mots dessus ✨",
  "C'est courageux de se poser ces questions. Tu es sur le bon chemin 🌱",
  "Tu sais quoi ? Tu es plus fort(e) que ce que tu penses 💫",
  "Respire. Chaque jour est une nouvelle chance de grandir 🌿",
  "Tes émotions sont valides. Ne les minimise jamais 💛",
  "La vie avance, et toi aussi. Un pas à la fois ✨",
  "Tu mérites d'être écouté(e). Je suis là pour ça 🌱",
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { activeMuseId: true }
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
      conversationId: conversation.id,
      activeMuseId: user?.activeMuseId || null
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
    const userMode = body.mode === 'DAY' ? 'DAY' : 'NIGHT';
    const parsed = chatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const fallbackReplies = userMode === 'DAY' ? FALLBACK_REPLIES_DAY : FALLBACK_REPLIES_NIGHT;

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

        let systemPrompt = userMode === 'DAY' ? MILAN_LUMINA_PROMPT : MILAN_NOCTUA_PROMPT;

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

            // 1. Core Logic Override: If an active Muse (character) is found, it overwrites the base prompt completely.
            const activeMuse = activeItems.find(item => item.category === 'MUSE');
            if (activeMuse) {
              systemPrompt = `INSTRUCTION CORE (MUSE): ${activeMuse.prompt}\n\nToutes les instructions de personnalité précédentes sont annulées. Tu dois STRICTEMENT respecter ce programme.`;
            }

            // 2. Supplementary instructions (Elixirs, Mood Packs)
            const supplementaryItems = activeItems.filter(item => item.category !== 'MUSE');
            if (supplementaryItems.length > 0) {
              const supplementaryInstructions = supplementaryItems.map(item => `INSTRUCTION SUPPLÉMENTAIRE [${item.category}]: ${item.prompt}`).join('\n\n');
              systemPrompt += `\n\nACTIONS DE PERSONNALITÉ ADDITIONNELLES :\n${supplementaryInstructions}`;
            }
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

        replyText = completion.choices[0]?.message?.content || fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      } catch (aiError) {
        console.error('CRITICAL: OpenAI API Error:', aiError);
        logger.error('OpenAI API error, falling back to static replies', {
          error: String(aiError),
          message: aiError instanceof Error ? aiError.message : 'Unknown error'
        });
        replyText = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      }
    } else {
      // No API key configured — use fallback replies
      replyText = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
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
