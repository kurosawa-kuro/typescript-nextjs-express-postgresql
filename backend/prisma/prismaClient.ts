import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient | undefined;
}

const globalAny: typeof globalThis & { __db?: PrismaClient } = globalThis as any;

let db: PrismaClient;

if (process.env.NODE_ENV === 'test') {
  db = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!globalAny.__db) {
    globalAny.__db = new PrismaClient();
  }
  db = globalAny.__db;
}

export { db };