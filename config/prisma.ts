import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL!;

const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
});

export const prisma = new PrismaClient({
  adapter,
});
