import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { vaultPIN: true }
    });

    return NextResponse.json({ hasPIN: !!user?.vaultPIN });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { pin } = await req.json();
    if (!pin || pin.length !== 4) {
        return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 });
    }

    // Hash the PIN for security
    const hashedPIN = await bcrypt.hash(pin, 10);

    await prisma.user.update({
        where: { id: session.user.id },
        data: { vaultPIN: hashedPIN }
    });

    return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { pin } = await req.json();

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { vaultPIN: true }
    });

    if (!user?.vaultPIN) {
        return NextResponse.json({ error: 'No PIN set' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(pin, user.vaultPIN);

    return NextResponse.json({ valid: isValid });
}
