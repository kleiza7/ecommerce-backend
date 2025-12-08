import { NextFunction, Request, Response } from "express";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.body.page ?? 1);
      const limit = Number(req.body.limit ?? 10);

      const brandId = req.body.brandId ? Number(req.body.brandId) : undefined;
      const categoryId = req.body.categoryId
        ? Number(req.body.categoryId)
        : undefined;

      const result = await this.productsService.getProducts({
        page,
        limit,
        brandId,
        categoryId,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await this.productsService.getProductById(id);
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, brandId, categoryId } = req.body;

      const product = await this.productsService.createProduct({
        name,
        description,
        price: Number(price),
        brandId: Number(brandId),
        categoryId: Number(categoryId),
      });

      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const { name, description, price, brandId, categoryId } = req.body;

      const updated = await this.productsService.updateProduct(id, {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        brandId: brandId !== undefined ? Number(brandId) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      });

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.productsService.deleteProduct(id);

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
