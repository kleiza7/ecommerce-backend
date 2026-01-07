import { NextFunction, Request, Response } from "express";
import { PRODUCT_STATUS } from "../enums/ProductStatus.enum";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";
import { ProductsService } from "../services/Products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  /* ===========================
     PUBLIC PRODUCT LIST
  =========================== */
  getProductsList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.body.page ?? 1);
      const limit = Number(req.body.limit ?? 20);

      const brandIds = Array.isArray(req.body.brandIds)
        ? req.body.brandIds.map(Number)
        : [];

      const categoryIds = Array.isArray(req.body.categoryIds)
        ? req.body.categoryIds.map(Number)
        : [];

      const sellerIds = Array.isArray(req.body.sellerIds)
        ? req.body.sellerIds.map(Number)
        : [];

      const result = await this.productsService.getProductsList({
        pagination: { page, limit },
        brandIds,
        categoryIds,
        sellerIds,
        statuses: [PRODUCT_STATUS.APPROVED],
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  /* ===========================
     SELLER - OWN PRODUCTS
  =========================== */
  getProductsBySeller = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sellerId = req.user!.id;

      const brandIds = Array.isArray(req.body.brandIds)
        ? req.body.brandIds.map(Number)
        : [];

      const categoryIds = Array.isArray(req.body.categoryIds)
        ? req.body.categoryIds.map(Number)
        : [];

      const result = await this.productsService.getProductsList({
        brandIds,
        categoryIds,
        sellerIds: [sellerId],
        statuses: [
          PRODUCT_STATUS.APPROVED,
          PRODUCT_STATUS.WAITING_FOR_APPROVE,
          PRODUCT_STATUS.NOT_APPROVED,
        ],
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  /* ===========================
     ADMIN - WAITING APPROVAL
  =========================== */
  getWaitingApprovalProducts = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const brandIds = Array.isArray(req.body.brandIds)
        ? req.body.brandIds.map(Number)
        : [];

      const categoryIds = Array.isArray(req.body.categoryIds)
        ? req.body.categoryIds.map(Number)
        : [];

      const sellerIds = Array.isArray(req.body.sellerIds)
        ? req.body.sellerIds.map(Number)
        : [];

      const result = await this.productsService.getProductsList({
        brandIds,
        categoryIds,
        sellerIds,
        statuses: [PRODUCT_STATUS.WAITING_FOR_APPROVE],
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  /* ===========================
     ADMIN - APPROVE
  =========================== */
  approveProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
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

  /* ===========================
     ADMIN - REJECT
  =========================== */
  rejectProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
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

  /* ===========================
     GET BY ID
  =========================== */
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await this.productsService.getProductById(id);
      return res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };

  /* ===========================
     CREATE
  =========================== */
  createProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
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
        files
      );

      return res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  };

  /* ===========================
     UPDATE
  =========================== */
  updateProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
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
        files
      );

      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  /* ===========================
     DELETE (SOFT)
  =========================== */
  deleteProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
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
