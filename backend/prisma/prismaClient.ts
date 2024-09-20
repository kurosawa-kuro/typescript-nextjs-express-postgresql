import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// テスト環境でのPrismaClientの管理を改善する
const getPrismaClient = () => {
  if (process.env.NODE_ENV === "test") {
    // テストのたびに新しいインスタンスを生成
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  // 開発環境ではグローバルインスタンスを再利用
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  return global.prisma;
}

const db = getPrismaClient();

export { db };
