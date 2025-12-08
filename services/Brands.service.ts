import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { generateSlug } from "../utils/Slug.util";

export class BrandsService {
  async getAllBrands() {
    return prisma.brand.findMany();
  }

  async getBrandById(id: number) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new AppError("Brand not found", 404);
    }

    return brand;
  }

  async createBrand(name: string) {
    const slug = generateSlug(name);

    return prisma.brand.create({
      data: {
        name,
        slug,
      },
    });
  }

  async updateBrand(id: number, data: { name?: string }) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new AppError("Brand not found", 404);
    }

    const slug = data.name ? generateSlug(data.name) : undefined;

    return prisma.brand.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });
  }

  async deleteBrand(id: number) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new AppError("Brand not found", 404);
    }

    await prisma.brand.delete({
      where: { id },
    });

    return true;
  }
}
