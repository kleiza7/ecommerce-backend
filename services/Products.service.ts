import { AppError } from "../errors/AppError";
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
    const products = await Product.findAll({
      where: { brand_id: brandId },
      attributes: ["id", "name", "description", "price"],
    });

    if (products.length === 0) {
      throw new AppError("No products found for this brand", 404);
    }

    return products;
  }

  async getProductById(id: number) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    brandId: number;
    categoryId: number;
  }) {
    const brand = await Brand.findByPk(data.brandId);
    if (!brand) {
      throw new AppError("Invalid brandId", 400);
    }

    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw new AppError("Invalid categoryId", 400);
    }

    return Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      brand_id: data.brandId,
      category_id: data.categoryId,
    });
  }

  async updateProduct(id: number, data: Partial<Product>) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (data.brand_id) {
      const brand = await Brand.findByPk(data.brand_id);
      if (!brand) {
        throw new AppError("Invalid brand_id", 400);
      }
    }

    if (data.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        throw new AppError("Invalid category_id", 400);
      }
    }

    await product.update(data);
    return product;
  }

  async deleteProduct(id: number) {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await product.destroy();
    return true;
  }
}
