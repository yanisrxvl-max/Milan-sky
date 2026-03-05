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

        // 1. Total Revenue (Transactions of type SKYCOINS_SPEND or SKYCOINS_PURCHASE for EUR check)
        const transactions = await prisma.transaction.findMany();
        const totalRevenue = transactions
            .filter(t => t.type === 'SKYCOINS_SPEND')
            .reduce((acc, t) => acc + t.amount, 0);

        // 2. Active Users (approximate by sessions expiring in the future)
        const activeUsers = await prisma.user.count();

        // 3. Top Content
        const contents = await prisma.content.findMany({
            include: {
                purchases: true,
            }
        });

        const topContent = contents
            .map(c => ({
                id: c.id,
                title: c.title,
                imageUrl: c.imageUrl,
                purchases: c.purchases.length,
                revenue: c.purchases.length * c.price,
            }))
            .sort((a, b) => b.purchases - a.purchases)
            .slice(0, 5);

        // 4. Muse Sales
        const musePurchases = await prisma.MusePurchase.findMany({
            include: { muse: true }
        });
        const museSales = musePurchases.reduce((acc: number, p: any) => acc + p.muse.price, 0);

        return NextResponse.json({
            totalRevenue,
            activeUsers,
            museSales,
            topContent
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
