import { Product } from "../models/Product.model";

export class ProductsService {
  async getAllProducts() {
    return await Product.findAll({
      attributes: ["id", "name", "description", "price"],
    });
  }

  async getProductsByBrandId(brandId: string) {
    return await Product.findAll({
      where: { brand_id: brandId },
      attributes: ["id", "name", "description", "price"],
    });
  }

  async getProductById(id: string) {
    return await Product.findByPk(id);
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    brandId: number;
    categoryId: number;
  }) {
    return await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      brand_id: data.brandId,
      category_id: data.categoryId,
    });
  }
}
