import { Brand } from "../models/Brand.model";
import { Category } from "../models/Category.model";
import { Product } from "../models/Product.model";

export class ProductsService {
  async getAllProducts() {
    return Product.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "brand_id",
        "category_id",
      ],
    });
  }

  async getProductsByBrandId(brandId: number) {
    return Product.findAll({
      where: { brand_id: brandId },
      attributes: ["id", "name", "description", "price"],
    });
  }

  async getProductById(id: number) {
    return Product.findByPk(id);
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    brandId: number;
    categoryId: number;
  }) {
    const brand = await Brand.findByPk(data.brandId);
    if (!brand) return null;

    const category = await Category.findByPk(data.categoryId);
    if (!category) return null;

    const product = await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      brand_id: data.brandId,
      category_id: data.categoryId,
    });

    return product;
  }

  async updateProduct(id: number, data: Partial<Product>) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    if (data.brand_id) {
      const brand = await Brand.findByPk(data.brand_id);
      if (!brand) return null;
    }

    if (data.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) return null;
    }

    await product.update(data);
    return product;
  }

  async deleteProduct(id: number) {
    const product = await Product.findByPk(id);
    if (!product) return false;

    await product.destroy();
    return true;
  }
}
