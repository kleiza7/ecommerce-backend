import { NextFunction, Request, Response } from "express";
import { PRODUCT_STATUS } from "../enums/ProductStatus.enum";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getProductsList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.body.page ?? 1);
      const limit = Number(req.body.limit ?? 20);

      const rawQuery =
        typeof req.body.filter.query === "string"
          ? req.body.filter.query.trim()
          : "";

      const query = rawQuery.length ? rawQuery : undefined;

      const filter = {
        brandIds: req.body.filter.brandIds,
        categoryIds: req.body.filter.categoryIds,
        sellerIds: req.body.filter.sellerIds,
        statuses: [PRODUCT_STATUS.APPROVED],
        query,
      };

      const sort = req.body.sort;

      const result = await this.productsService.getProductsListWithPagination({
        pagination: { page, limit },
        filter,
        sort,
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getProductsBySeller = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const sellerId = req.user!.id;

      const result =
        await this.productsService.getProductsListWithoutPagination({
          filter: {
            brandIds: [],
            categoryIds: [],
            sellerIds: [sellerId],
            statuses: [
              PRODUCT_STATUS.APPROVED,
              PRODUCT_STATUS.WAITING_FOR_APPROVE,
              PRODUCT_STATUS.NOT_APPROVED,
            ],
          },
        });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getWaitingApprovalProducts = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result =
        await this.productsService.getProductsListWithoutPagination({
          filter: {
            brandIds: [],
            categoryIds: [],
            sellerIds: [],
            statuses: [PRODUCT_STATUS.WAITING_FOR_APPROVE],
          },
        });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  approveProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = Number(req.params.id);

      await this.productsService.changeProductStatus({
        productId,
        status: PRODUCT_STATUS.APPROVED,
      });

      return res.status(200).json({
        message: "Product approved successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  rejectProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = Number(req.params.id);

      await this.productsService.changeProductStatus({
        productId,
        status: PRODUCT_STATUS.NOT_APPROVED,
      });

      return res.status(200).json({
        message: "Product rejected successfully",
      });
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

  createProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        name,
        description,
        stockCount,
        price,
        brandId,
        categoryId,
        currencyId,
      } = req.body;

      const sellerId = req.user!.id;
      const files = req.files as Express.Multer.File[];

      const product = await this.productsService.createProduct(
        {
          name,
          description,
          stockCount: Number(stockCount),
          price: Number(price),
          brandId: Number(brandId),
          categoryId: Number(categoryId),
          currencyId: Number(currencyId),
          sellerId,
        },
        files,
      );

      return res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  };

  updateProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        id,
        name,
        description,
        stockCount,
        price,
        brandId,
        categoryId,
        currencyId,
        deletedImageIds,
      } = req.body;

      const sellerId = req.user!.id;
      const files = req.files as Express.Multer.File[];

      let parsedDeletedIds: number[] = [];
      if (deletedImageIds) {
        try {
          parsedDeletedIds = JSON.parse(deletedImageIds);
        } catch {
          parsedDeletedIds = [];
        }
      }

      const updated = await this.productsService.updateProduct(
        {
          id: Number(id),
          name,
          description,
          stockCount: Number(stockCount),
          price: Number(price),
          brandId: Number(brandId),
          categoryId: Number(categoryId),
          currencyId: Number(currencyId),
          sellerId,
          deletedImageIds: parsedDeletedIds,
        },
        files,
      );

      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  deleteProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const sellerId = req.user!.id;

      await this.productsService.deleteProduct(id, sellerId);

      return res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
