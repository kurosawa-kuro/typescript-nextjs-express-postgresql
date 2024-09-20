// backend/prisma/prismaClient.ts

// External Imports
import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient | undefined;
  namespace NodeJS {
    interface Global {
      __db: PrismaClient | undefined;
    }
  }
}

// Use `globalThis` instead of `global` for better cross-environment compatibility
const globalAny: typeof globalThis & { __db?: PrismaClient } = globalThis as any;

let db: PrismaClient;

if (!globalAny.__db) {
  globalAny.__db = new PrismaClient();
}

db = globalAny.__db;

export { db };