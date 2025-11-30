import { Brand } from "../models/Brand.model";

export class BrandsService {
  async getAllBrands() {
    return await Brand.findAll();
  }

  async getBrandById(id: string) {
    return await Brand.findByPk(id);
  }

  async createBrand(name: string) {
    return await Brand.create({ name });
  }
}
