import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({
  adapter,
}).$extends({
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

    order: {
      totalPrice: {
        needs: { totalPrice: true },
        compute(order) {
          return Number(order.totalPrice);
        },
      },
    },

    orderItem: {
      priceSnapshot: {
        needs: { priceSnapshot: true },
        compute(orderItem) {
          return Number(orderItem.priceSnapshot);
        },
      },
    },
  },
});
