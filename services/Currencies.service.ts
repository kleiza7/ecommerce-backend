import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

export class CurrencyService {
  async getAllCurrencies() {
    return prisma.currency.findMany();
  }

  async getCurrencyById(id: number) {
    const currency = await prisma.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new AppError("Currency not found", 404);
    }

    return currency;
  }

  async createCurrency(payload: { code: string; symbol: string }) {
    const { code, symbol } = payload;

    const existingCurrency = await prisma.currency.findUnique({
      where: { code },
    });

    if (existingCurrency) {
      throw new AppError("Currency already exists", 400);
    }

    return prisma.currency.create({
      data: {
        code,
        symbol,
      },
    });
  }

  async updateCurrency(payload: { id: number; code: string; symbol: string }) {
    const { id, code, symbol } = payload;

    const currency = await prisma.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new AppError("Currency not found", 404);
    }

    // başka bir currency aynı code'u kullanıyor mu?
    const existingCurrency = await prisma.currency.findUnique({
      where: { code },
    });

    if (existingCurrency && existingCurrency.id !== id) {
      throw new AppError("Currency code already exists", 400);
    }

    return prisma.currency.update({
      where: { id },
      data: {
        code,
        symbol,
      },
    });
  }

  async deleteCurrency(id: number) {
    const currency = await prisma.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new AppError("Currency not found", 404);
    }

    await prisma.currency.delete({
      where: { id },
    });

    return true;
  }
}
