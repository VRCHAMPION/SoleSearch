const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const alerts = await prisma.priceAlert.findMany();
    console.log("Found alerts:", alerts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
