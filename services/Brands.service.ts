import { AppError } from "../errors/AppError";
import { Brand } from "../models/Brand.model";
import { generateSlug } from "../utils/Slug.util";

export class BrandsService {
  async getAllBrands() {
    return Brand.findAll();
  }

  async getBrandById(id: number) {
    const brand = await Brand.findByPk(id);

    if (!brand) {
      throw new AppError("Brand not found", 404);
    }

    return brand;
  }

  async createBrand(name: string) {
    const slug = generateSlug(name);

    return Brand.create({
      name,
      slug,
    });
  }

  async updateBrand(id: number, data: Partial<Brand>) {
    const brand = await Brand.findByPk(id);

    if (!brand) {
      throw new AppError("Brand not found", 404);
    }

    if (data.name) {
      data.slug = generateSlug(data.name);
    }

    await brand.update(data);
    return brand;
  }

  async deleteBrand(id: number) {
    const brand = await Brand.findByPk(id);

    if (!brand) {
      throw new AppError("Brand not found", 404);
    }

    await brand.destroy();
    return true;
  }
}
