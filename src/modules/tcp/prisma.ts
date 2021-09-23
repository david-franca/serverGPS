import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient({ rejectOnNotFound: true });
  }
  prisma = globalThis.prisma;
}

export default prisma;
