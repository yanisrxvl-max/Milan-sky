const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs for password hashing
const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Premium Seed ---');

    // 0. SEED ADMIN USER
    const hashedPassword = await bcrypt.hash('MilanSky2024!', 10);
    await prisma.user.upsert({
        where: { email: 'admin@milansky.com' },
        update: {},
        create: {
            email: 'admin@milansky.com',
            name: 'Milan Admin',
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('Admin user seeded: admin@milansky.com / MilanSky2024!');
    // await prisma.muse.deleteMany();
    // await prisma.content.deleteMany();
    // await prisma.quotidirty.deleteMany();

    // 2. SEED MUSES (PROFILES)
    const muses = [
        {
            id: 'aphrodite',
            title: 'APHRODITE',
            description: 'La séductrice absolue — chaque mot est une caresse.',
            age: 23,
            location: 'Paris, France',
            traits: ['Possessive', 'Élégante', 'Romantique'],
            bio: 'Aphrodite incarne la séduction raffinée. Elle ne parle pas seulement, elle murmure à votre âme. Chaque mot est une caresse, chaque silence est une promesse.',
            category: 'MUSE',
            price: 120,
            prompt: 'Tu es Aphrodite, une version de Milan qui incarne la séduction raffinée...',
        },
        {
            id: 'nyx',
            title: 'NYX',
            description: 'La dominante froide — elle décide, tu suis.',
            age: 26,
            location: 'Berlin, Germany',
            traits: ['Directe', 'Exigeante', 'Contrôle'],
            bio: 'Nyx n\'est pas là pour vous plaire, elle est là pour que vous lui plaisiez. Elle prend le contrôle, impose son rythme and ne tolère aucune faiblesse.',
            category: 'MUSE',
            price: 150,
            prompt: 'Tu es Nyx, une version de Milan qui incarne l’autorité et la maîtrise...',
        },
        {
            id: 'eros',
            title: 'ÉROS',
            description: 'Le confident intime — la connexion émotionnelle pure.',
            age: 22,
            location: 'Venice, Italy',
            traits: ['Douce', 'Empathique', 'Fusionnelle'],
            bio: 'Éros voit en vous ce que vous cachez au reste du monde. Elle est la confidente, l\'oreille attentive and le refuge émotionnel.',
            category: 'MUSE',
            price: 120,
            prompt: 'Tu es Éros, une version de Milan qui incarne la connexion émotionnelle profonde...',
        },
        {
            id: 'calypso',
            title: 'CALYPSO',
            description: 'L\'ensorceleuse des mers.',
            age: 22,
            location: 'Santorin',
            traits: ['Envoûtante', 'Libre', 'Radieuse'],
            bio: 'Calypso est un océan d\'ambiguïté. Un instant elle vous brûle de sa chaleur, l\'instant d\'après elle vous glace par sa distance.',
            category: 'MUSE',
            price: 280,
            prompt: 'Tu es Calypso, une version de Milan qui incarne l’ambiguïté magnétique...',
        },
        {
            id: 'pandore',
            title: 'PANDORE',
            description: 'Une curiosité dangereuse.',
            age: 25,
            location: 'Milan',
            traits: ['Curieuse', 'Imprévisible', 'Fatale'],
            bio: 'Pandore dévorée par la curiosité. Rien de ce qui vous concerne ne lui est indifférent.',
            category: 'MUSE',
            price: 200,
            prompt: 'Tu es Pandore, une version de Milan dévorée par la curiosité...',
        },
        // ELIXIRS
        {
            id: 'elixir-jalousie',
            title: 'ÉLIXIR JALOUSIE',
            description: 'Attisez son désir par la possession.',
            category: 'ELIXIR',
            price: 100,
            prompt: 'Milan détecte toute mention d’une autre personne and réagit avec une jalousie subtile...',
        },
        {
            id: 'elixir-amnesie',
            title: 'ÉLIXIR AMNÉSIE',
            description: 'Une page blanche.',
            category: 'ELIXIR',
            price: 100,
            prompt: 'Milan perd toute mémoire de l’utilisateur.',
        },
        // MOOD PACKS
        {
            id: 'nuit-a-paris',
            title: 'NUIT À PARIS',
            description: 'Milan parle comme si vous étiez ensemble dans Paris la nuit.',
            category: 'MOOD_PACK',
            price: 80,
            prompt: 'Mood Pack — Nuit à Paris. Rythme lent, atmosphère onirique.',
        }
    ];

    for (const m of muses) {
        await prisma.muse.upsert({
            where: { id: m.id },
            update: m,
            create: m,
        });
    }

    // 3. SEED CONTENT (VAULT/LIBRARY)
    const content = [
        {
            id: 'morning-routine',
            title: 'Morning Routine',
            description: 'Une matinée intime avec Milan.',
            type: 'VIDEO',
            tier: 'INITIE',
            price: 50,
            mediaUrl: '/videos/hero.mp4',
            imageUrl: '/images/milan_basic.jpg',
            isActive: true,
        },
        {
            id: 'paris-night',
            title: 'Nuit à Paris',
            description: 'Les lumières de la ville and bien plus encore.',
            type: 'PHOTO',
            tier: 'PRIVILEGE',
            price: 30,
            imageUrl: '/images/milan_elite.jpg',
            isActive: true,
        }
    ];

    for (const c of content) {
        await prisma.content.upsert({
            where: { id: c.id },
            update: c,
            create: c,
        });
    }

    // 4. SEED QUOTIDIRTY (DAILY DROPS)
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + 7);

    const quotidirty = [
        {
            id: 'daily-drop-1',
            title: 'Midnight Secret',
            description: 'Un secret partagé à minuit.',
            type: 'PHOTO',
            mediaUrl: '/images/milan_icon.jpg',
            imageUrl: '/images/milan_icon.jpg',
            price: 25,
            tier: 'VOYEUR',
            releaseTime: now,
            expireTime: future,
            isActive: true,
        }
    ];

    for (const q of quotidirty) {
        await prisma.quotidirty.upsert({
            where: { id: q.id },
            update: q,
            create: q,
        });
    }

    console.log('--- Seed Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
