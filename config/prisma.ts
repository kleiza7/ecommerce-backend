import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL!;

const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
});

export const prisma = new PrismaClient({
  adapter,
})
  // TODO: search this after
  .$extends({
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(product) {
            return Number(product.price);
          },
        },
      },

      cartItem: {
        priceSnapshot: {
          needs: { priceSnapshot: true },
          compute(cartItem) {
            return Number(cartItem.priceSnapshot);
          },
        },
      },
    },
  });
