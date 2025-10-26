// scripts/prisma.ts  ← クライアントからは参照しない
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// ブラウザで誤って読み込まれたら即座に失敗させる保険
if (typeof window !== 'undefined') {
  throw new Error('Do not import Prisma from the browser/Expo runtime.');
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error('Missing DATABASE_URL');

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url } },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
