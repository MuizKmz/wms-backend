import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.material.createMany({
    data: [
      { code: 'MAT001', name: 'Steel Bar', uom: 'kg', qty: 120 },
      { code: 'MAT002', name: 'Aluminium Sheet', uom: 'pcs', qty: 50 },
      { code: 'MAT003', name: 'Plastic Resin', uom: 'kg', qty: 300 },
    ],
  });
}

main()
  .then(() => console.log('🌱 Seeding done'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
