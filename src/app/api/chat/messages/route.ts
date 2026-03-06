import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { MessageType } from '@prisma/client';

import { chatMessageSchema } from '@/lib/validations';
import { sanitizeForDB } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import { openai, MILAN_LUMINA_PROMPT, MILAN_NOCTUA_PROMPT } from '@/lib/openai';

const CHAT_LIMITS: Record<string, number> = {
    VOYEUR: 10,
    INITIE: 999,
    PRIVILEGE: 999,
    SKYCLUB: 999,
};

const FALLBACK_REPLIES_NIGHT = [
    "Merci pour ton message 💫 Je prends note...",
    "Intéressant... j'aime ta curiosité 🖤",
    "Tu sais que t'es dans le bon univers ici ✨",
    "Je vois que tu veux aller plus loin... J'adore ça 🔥",
];

const FALLBACK_REPLIES_DAY = [
    "Merci de partager ça avec moi 💛 C'est important.",
    "Je t'écoute. Prends ton temps ✨",
    "C'est courageux de se poser ces questions 🌱",
    "Tu es plus fort(e) que ce que tu penses 💫",
];

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const messages = await prisma.message.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'asc' },
            take: 100,
        });

        const conversation = await prisma.conversation.findUnique({
            where: { userId: session.user.id },
        });

        // Get today's message count
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

        const tier = sub?.tier || 'VOYEUR';
        const limit = CHAT_LIMITS[tier] || 5;

        return NextResponse.json({
            messages,
            conversation,
            todayCount,
            dailyLimit: limit,
            remaining: Math.max(0, limit - todayCount),
        });
    } catch (error) {
        logger.error('Chat fetch error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const parsed = chatMessageSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
        }

        const { content, messageType = 'TEXT', mediaUrl, mode = 'NIGHT' } = body;

        // 1. Get or Create Conversation
        let conversation = await prisma.conversation.findUnique({
            where: { userId: session.user.id },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: { userId: session.user.id },
            });
        }

        // 2. Check Subscription & Limits
        const sub = await prisma.subscription.findUnique({
            where: { userId: session.user.id },
        });
        const tier = sub?.tier || 'VOYEUR';

        // VOYEUR cannot send media
        if (tier === 'VOYEUR' && (messageType === 'IMAGE' || messageType === 'VIDEO')) {
            return NextResponse.json({ error: 'Upgradez pour envoyer des médias' }, { status: 403 });
        }

        // Daily limit check
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCount = await prisma.message.count({
            where: {
                userId: session.user.id,
                sender: 'USER',
                createdAt: { gte: today },
            },
        });

        const limit = CHAT_LIMITS[tier] || 5;
        if (todayCount >= limit) {
            return NextResponse.json({ error: 'Limite quotidienne atteinte' }, { status: 429 });
        }

        // 3. Save User Message
        const userMessage = await prisma.message.create({
            data: {
                userId: session.user.id,
                conversationId: conversation.id,
                content: (content as string) || "",
                sender: 'USER',
                messageType: messageType as MessageType,
                mediaUrl: mediaUrl as string | null,
                isAI: false,
            },
        });

        // Update conversation
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessageAt: new Date(),
                unreadCount: { increment: 1 }, // Milan has 1 more unread
            },
        });

        // 4. AIService (Simulated or Real) — We'll trigger AI response if it's a text message
        const fallbacks = mode === 'DAY' ? FALLBACK_REPLIES_DAY : FALLBACK_REPLIES_NIGHT;
        let replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];

        if (openai && messageType === 'TEXT') {
            try {
                const systemPrompt = mode === 'DAY' ? MILAN_LUMINA_PROMPT : MILAN_NOCTUA_PROMPT;
                const completion = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: content },
                    ],
                    max_tokens: 200,
                });
                replyText = completion.choices[0]?.message?.content || replyText;
            } catch (e) {
                logger.error('OpenAI Error', { error: String(e) });
            }
        }

        const milanMessage = await prisma.message.create({
            data: {
                userId: session.user.id,
                conversationId: conversation.id,
                content: replyText,
                sender: 'MILAN',
                messageType: 'TEXT',
                isAI: true,
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
