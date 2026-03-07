const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const muses = await prisma.muse.findMany({
        select: {
            id: true,
            title: true,
            category: true,
            mode: true,
            isActive: true
        }
    });
    console.log(muses);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
