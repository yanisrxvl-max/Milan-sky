import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Seeding Ecosystems via API...');

        // 1. Tag existing content as NOCTUA (default) if not already set
        await prisma.muse.updateMany({ data: { mode: 'NOCTUA' } });
        await prisma.content.updateMany({ data: { mode: 'NOCTUA' } });
        await prisma.quotidirty.updateMany({ data: { mode: 'NOCTUA' } });

        // 2. Add Lumina Muses (White/Educational)
        await prisma.muse.createMany({
            data: [
                {
                    title: "Le Visionnaire Tech",
                    description: "Milan vous guide à travers les enjeux de l'IA et de la blockchain. Une vision froide et analytique du futur.",
                    prompt: "Vous êtes Milan Sky en mode Visionnaire Tech. Votre ton est intellectuel, visionnaire, sérieux et formateur. Vous parlez de technologie, d'économie et de futurisme.",
                    price: 50,
                    category: 'MUSE',
                    mode: 'LUMINA',
                    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
                    previewMessage: "Le futur n'attend pas ceux qui doutent."
                },
                {
                    title: "Le Mentor Lifestyle",
                    description: "Optimisez votre routine, votre charisme et votre impact social. Milan devient votre coach privé.",
                    prompt: "Vous êtes Milan Sky en mode Mentor Lifestyle. Vous donnez des conseils de haute qualité sur le charisme, l'élégance, la discipline et le succès social.",
                    price: 75,
                    category: 'MUSE',
                    mode: 'LUMINA',
                    imageUrl: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=800",
                    previewMessage: "L'élégance est la seule beauté qui ne se fane jamais."
                }
            ],
            skipDuplicates: true
        });

        // 3. Add Lumina Content
        await prisma.content.createMany({
            data: [
                {
                    title: "Masterclass: L'Empire Numérique",
                    description: "Comment Milan a construit sa propre Sphère. 45 minutes de stratégie pure.",
                    type: 'VIDEO',
                    tier: 'INITIE',
                    price: 0,
                    mode: 'LUMINA',
                    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
                }
            ],
            skipDuplicates: true
        });

        // 4. Add Games (Both modes)
        await prisma.game.createMany({
            data: [
                {
                    title: "Milan IQ Challenge",
                    description: "Mesurez votre vivacité d'esprit face à l'intelligence de Milan. Un test de logique et de rapidité.",
                    type: 'LOGIQUE',
                    mode: 'LUMINA',
                    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800"
                },
                {
                    title: "Les Secrets de la Sphère",
                    description: "Un jeu de piste numérique où chaque indice vous rapproche de l'intimité de Milan.",
                    type: 'AVENTURE',
                    mode: 'NOCTUA',
                    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"
                }
            ],
            skipDuplicates: true
        });

        return NextResponse.json({ success: true, message: 'Seeding completed' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
