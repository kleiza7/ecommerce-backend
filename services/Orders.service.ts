import { prisma } from "../config/prisma";
import { ORDER_STATUS } from "../enums/OrderStatus.enum";
import { AppError } from "../errors/AppError";
import { getUrlWithBaseUrl } from "../utils/Common.util";

export class OrdersService {
  async createOrder(userId: number) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    select: {
                      id: true,
                      thumbUrl: true,
                      isPrimary: true,
                    },
                    orderBy: { isPrimary: "desc" },
                  },
                },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
      }

      const currencyId = cart.items[0].currencyId;

      for (const item of cart.items) {
        if (item.currencyId !== currencyId) {
          throw new AppError("Mixed currency orders are not allowed", 400);
        }
      }

      let totalPrice = 0;

      for (const item of cart.items) {
        totalPrice += Number(item.priceSnapshot) * item.quantity;
      }

      for (const item of cart.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockCount: {
              gte: item.quantity,
            },
          },
          data: {
            stockCount: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count === 0) {
          throw new AppError(
            "Some products are out of stock. Please update your cart.",
            409
          );
        }
      }

      const order = await tx.order.create({
        data: {
          userId,
          status: ORDER_STATUS.PENDING,
          totalPrice,
          currencyId,
        },
      });

      await tx.orderItem.createMany({
        data: cart.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.product.name,
          priceSnapshot: item.priceSnapshot,
          quantity: item.quantity,
          currencyId: item.currencyId,
        })),
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      const createdOrder = await tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    select: {
                      id: true,
                      thumbUrl: true,
                      isPrimary: true,
                    },
                    orderBy: { isPrimary: "desc" },
                  },
                },
              },
            },
          },
        },
      });

      if (!createdOrder) {
        return order;
      }

      return {
        ...createdOrder,
        items: createdOrder.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            images: item.product.images.map((img) => ({
              ...img,
              thumbUrl: getUrlWithBaseUrl(img.thumbUrl),
            })),
          },
        })),
      };
    });
  }

  async completePayment(orderId: number, userId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new AppError("Order is not payable", 400);
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.PAID },
    });

    return true;
  }

  async cancelOrder(orderId: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (order.userId !== userId) {
        throw new AppError("Forbidden", 403);
      }

      if (order.status !== ORDER_STATUS.PENDING) {
        throw new AppError("Only pending orders can be canceled", 400);
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockCount: {
              increment: item.quantity,
            },
          },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: ORDER_STATUS.CANCELED },
      });

      return true;
    });
  }

  async getOrdersListByUser(userId: number) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  select: {
                    id: true,
                    thumbUrl: true,
                    isPrimary: true,
                  },
                  orderBy: { isPrimary: "desc" },
                },
              },
            },
          },
        },
      },
    });

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images.map((img) => ({
            ...img,
            thumbUrl: getUrlWithBaseUrl(img.thumbUrl),
          })),
        },
      })),
    }));
  }

  async getOrderById(orderId: number, userId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  select: {
                    id: true,
                    thumbUrl: true,
                    isPrimary: true,
                  },
                  orderBy: { isPrimary: "desc" },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images.map((img) => ({
            ...img,
            thumbUrl: getUrlWithBaseUrl(img.thumbUrl),
          })),
        },
      })),
    };
  }
}
