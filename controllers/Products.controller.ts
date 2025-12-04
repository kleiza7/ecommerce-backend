import { NextFunction, Request, Response } from "express";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getAllProducts = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productsService.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProductsByBrandId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const brandId = Number(req.params.brandId);
      const products = await this.productsService.getProductsByBrandId(brandId);
      return res.status(200).json(products);
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
