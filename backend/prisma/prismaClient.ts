import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

let db: PrismaClient;

if (!global.__db) {
  db = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Store the instance globally to prevent multiple instances in development and test
  global.__db = db;
} else {
  db = global.__db;
}

export { db };
