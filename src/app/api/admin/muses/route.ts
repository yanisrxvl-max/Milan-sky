import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Vérification admin
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.role !== 'ADMIN') return null;
    return user;
}

// GET — Liste toutes les Muses (admin)
export async function GET() {
    try {
        const admin = await checkAdmin();
        if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

        const muses = await prisma.muse.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { purchases: true } }
            }
        });

        return NextResponse.json({ muses });
    } catch (error) {
        logger.error('Admin muses GET error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST — Créer une nouvelle Muse
export async function POST(request: NextRequest) {
    try {
        const admin = await checkAdmin();
        if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

        const contentType = request.headers.get('content-type') || '';

        let data: any;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            data = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                prompt: formData.get('prompt') as string,
                price: parseInt(formData.get('price') as string) || 0,
                category: (formData.get('category') as string) || 'MUSE',
                previewMessage: (formData.get('previewMessage') as string) || null,
                isActive: formData.get('isActive') === 'true',
            };

            // Handle image upload
            const imageFile = formData.get('image') as File | null;
            if (imageFile && imageFile.size > 0) {
                data.imageUrl = await saveFile(imageFile, 'muses');
            }

            const bgFile = formData.get('backgroundImage') as File | null;
            if (bgFile && bgFile.size > 0) {
                data.backgroundImage = await saveFile(bgFile, 'muses-bg');
            }
        } else {
            data = await request.json();
        }

        if (!data.title || !data.description || !data.prompt) {
            return NextResponse.json({ error: 'Titre, description et prompt requis' }, { status: 400 });
        }

        const muse = await prisma.muse.create({
            data: {
                title: data.title,
                description: data.description,
                prompt: data.prompt,
                price: data.price || 0,
                category: data.category || 'MUSE',
                previewMessage: data.previewMessage || null,
                imageUrl: data.imageUrl || null,
                backgroundImage: data.backgroundImage || null,
                isActive: data.isActive ?? true,
            }
        });

        return NextResponse.json({ muse }, { status: 201 });
    } catch (error) {
        logger.error('Admin muses POST error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// PUT — Modifier une Muse existante
export async function PUT(request: NextRequest) {
    try {
        const admin = await checkAdmin();
        if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

        const contentType = request.headers.get('content-type') || '';

        let data: any;
        let museId: string;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            museId = formData.get('id') as string;
            data = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                prompt: formData.get('prompt') as string,
                price: parseInt(formData.get('price') as string) || 0,
                category: (formData.get('category') as string) || 'MUSE',
                previewMessage: (formData.get('previewMessage') as string) || null,
                isActive: formData.get('isActive') === 'true',
            };

            const imageFile = formData.get('image') as File | null;
            if (imageFile && imageFile.size > 0) {
                data.imageUrl = await saveFile(imageFile, 'muses');
            }

            const bgFile = formData.get('backgroundImage') as File | null;
            if (bgFile && bgFile.size > 0) {
                data.backgroundImage = await saveFile(bgFile, 'muses-bg');
            }
        } else {
            const body = await request.json();
            museId = body.id;
            data = body;
            delete data.id;
        }

        if (!museId) {
            return NextResponse.json({ error: 'ID de la Muse requis' }, { status: 400 });
        }

        // Clean up undefined image fields (don't overwrite with null if no new upload)
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.prompt !== undefined) updateData.prompt = data.prompt;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.previewMessage !== undefined) updateData.previewMessage = data.previewMessage;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.backgroundImage !== undefined) updateData.backgroundImage = data.backgroundImage;

        const muse = await prisma.muse.update({
            where: { id: museId },
            data: updateData,
        });

        return NextResponse.json({ muse });
    } catch (error) {
        logger.error('Admin muses PUT error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE — Supprimer une Muse
export async function DELETE(request: NextRequest) {
    try {
        const admin = await checkAdmin();
        if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        // Delete associated purchases first
        await prisma.musePurchase.deleteMany({ where: { museId: id } });
        await prisma.muse.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('Admin muses DELETE error', { error: String(error) });
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Helper — Save uploaded file to public/uploads/
async function saveFile(file: File, subfolder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    return `/uploads/${subfolder}/${filename}`;
}
