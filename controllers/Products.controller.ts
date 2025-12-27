import { NextFunction, Request, Response } from "express";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.body.page ?? 1);
      const limit = Number(req.body.limit ?? 20);

      const brandIds = Array.isArray(req.body.brandIds)
        ? req.body.brandIds.map(Number)
        : [];

      const categoryIds = Array.isArray(req.body.categoryIds)
        ? req.body.categoryIds.map(Number)
        : [];

      const result = await this.productsService.getProducts({
        page,
        limit,
        brandIds,
        categoryIds,
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await this.productsService.getProductById(id);
      return res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        description,
        stockCount,
        price,
        brandId,
        categoryId,
        currencyId, // ✅ EKLENDİ
      } = req.body;

      const files = req.files as Express.Multer.File[];

      const product = await this.productsService.createProduct(
        {
          name,
          description,
          stockCount: Number(stockCount),
          price: Number(price),
          brandId: Number(brandId),
          categoryId: Number(categoryId),
          currencyId: Number(currencyId), // ✅ EKLENDİ
        },
        files
      );

      return res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        id,
        name,
        description,
        stockCount,
        price,
        brandId,
        categoryId,
        currencyId, // ✅ EKLENDİ
        deletedImageIds,
      } = req.body;

      const files = req.files as Express.Multer.File[];

      // deletedImageIds body'de string geliyorsa (multipart), güvenli parse
      let parsedDeletedIds: number[] = [];
      if (deletedImageIds) {
        try {
          parsedDeletedIds = JSON.parse(deletedImageIds);
        } catch {
          parsedDeletedIds = [];
        }
      }

      const payload = {
        id: Number(id),
        name,
        description,
        stockCount: Number(stockCount),
        price: Number(price),
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        currencyId: Number(currencyId), // ✅ EKLENDİ
        deletedImageIds: parsedDeletedIds,
      };

      const updated = await this.productsService.updateProduct(payload, files);

      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.productsService.deleteProduct(id);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
