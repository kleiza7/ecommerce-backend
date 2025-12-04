import { Brand } from "../models/Brand.model";
import { generateSlug } from "../utils/Slug.util";

export class BrandsService {
  async getAllBrands() {
    return Brand.findAll();
  }

  async getBrandById(id: number) {
    return Brand.findByPk(id);
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
    if (!brand) return null;

    if (data.name) {
      data.slug = generateSlug(data.name);
    }

    await brand.update(data);
    return brand;
  }

  async deleteBrand(id: number) {
    const brand = await Brand.findByPk(id);
    if (!brand) return false;

    await brand.destroy();
    return true;
  }
}
