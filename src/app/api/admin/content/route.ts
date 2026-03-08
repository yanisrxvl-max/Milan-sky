import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { bunny } from '@/lib/bunny';
import { logger } from '@/lib/logger';
import { ContentType, SubscriptionTier } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const formData = await request.formData();

        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string | null;
        const type = formData.get('type') as ContentType;
        const tier = formData.get('tier') as SubscriptionTier;
        const priceStr = formData.get('price') as string;

        if (!file || !title || !type || !tier || !priceStr) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        const price = parseInt(priceStr, 10);

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        let mediaUrl = '';
        let imageUrl = '';
        let bunnyStreamId = null;

        if (type === 'VIDEO') {
            // Upload to Bunny Stream for 4K / HLS
            bunnyStreamId = await bunny.uploadToStream(buffer, title);
            imageUrl = bunny.getThumbnailUrl(bunnyStreamId);
        } else {
            // Upload Image to Bunny Storage
            mediaUrl = await bunny.uploadToStorage(buffer, fileName);
            imageUrl = mediaUrl;
        }

        // Create db record
        const content = await prisma.content.create({
            data: {
                title,
                description,
                type,
                tier,
                price,
                mediaUrl: mediaUrl || '',
                imageUrl,
                bunnyStreamId,
            } as any
        });

        logger.info('Admin uploaded new content', { contentId: content.id, type, tier });

        return NextResponse.json({ success: true, content });

    } catch (error) {
        console.error('SERVER UPLOAD ERROR:', error);
        logger.error('Content upload error', { error: String(error) });
        return NextResponse.json({
            error: 'Erreur lors du téléchargement',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const content = await prisma.content.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ content });

    } catch (error) {
        logger.error('Content fetch error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
    }
}
