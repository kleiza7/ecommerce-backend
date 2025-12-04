import { NextFunction, Request, Response } from "express";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, brandId, categoryId } = req.body;

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
      const product = await this.productsService.createProduct(req.body);
      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updated = await this.productsService.updateProduct(id, req.body);
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
