// backend/prisma/prismaClient.ts

import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient | undefined;
}

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
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };