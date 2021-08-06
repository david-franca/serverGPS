import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const adapterData: Prisma.DeviceCreateInput[] = [
  {
    code: 1,
    description: 'ST310',
    model: 'SUNTECH',
    equipmentNumber: '511009943',
    phone: '85987884378',
    mobileOperator: 'Oi',
    chipNumber: '85987884378',
    timezone: 'GMT_3',
  },
  {
    code: 2,
    description: 'GT06',
    model: 'GT06',
    equipmentNumber: '866968030810130',
    phone: '85987884378',
    mobileOperator: 'Oi',
    chipNumber: '85987884379',
    timezone: 'GMT_3',
  },
];

async function main() {
  // Prisma create query to seed models in database
  console.log(`Start seeding ...`);
  for (const a of adapterData) {
    const adapter = await prisma.device.create({
      data: a,
    });
    console.log(`Created user with id: ${adapter.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
