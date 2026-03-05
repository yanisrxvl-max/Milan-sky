import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const drops = await prisma.quotidirty.findMany({
            orderBy: { releaseTime: 'desc' },
        });

        return NextResponse.json({ drops });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, imageUrl, mediaUrl, price, tier, releaseTime, expireTime } = await req.json();

        const drop = await prisma.quotidirty.create({
            data: {
                title,
                description,
                imageUrl,
                mediaUrl,
                price: parseInt(price),
                tier,
                releaseTime: new Date(releaseTime),
                expireTime: new Date(expireTime),
            },
        });

        return NextResponse.json({ drop });
    } catch (error) {
        console.error('Error creating Quotidirty:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
