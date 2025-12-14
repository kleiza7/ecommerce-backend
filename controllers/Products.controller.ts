import { NextFunction, Request, Response } from "express";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.body.page ?? 1);
      const limit = Number(req.body.limit ?? 20);

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
      const { name, description, stockCount, price, brandId, categoryId } =
        req.body;

      const files = req.files as Express.Multer.File[];

      const product = await this.productsService.createProduct(
        {
          name,
          description,
          stockCount: Number(stockCount),
          price: Number(price),
          brandId: Number(brandId),
          categoryId: Number(categoryId),
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
      const id = Number(req.params.id);

      const {
        name,
        description,
        stockCount,
        price,
        brandId,
        categoryId,
        deletedImageIds,
      } = req.body;

      const files = req.files as Express.Multer.File[];

      let parsedDeletedIds: number[] = [];
      if (deletedImageIds) {
        try {
          parsedDeletedIds = JSON.parse(deletedImageIds);
        } catch {
          parsedDeletedIds = [];
        }
      }

      const payload = {
        name,
        description,
        stockCount: stockCount !== undefined ? Number(stockCount) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        brandId: brandId !== undefined ? Number(brandId) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
        deletedImageIds: parsedDeletedIds,
      };

      const updated = await this.productsService.updateProduct(
        id,
        payload,
        files
      );

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
