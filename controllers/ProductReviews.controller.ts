import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";
import { ProductReviewsService } from "../services/ProductReviews.service";

export class ProductReviewsController {
  constructor(private productReviewsService: ProductReviewsService) {}

  getReviewsByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = Number(req.params.productId);

      const reviews =
        await this.productReviewsService.getReviewsByProductId(productId);

      return res.status(200).json(reviews);
    } catch (err) {
      next(err);
    }
  };

  createReview = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const { productId, rating, comment } = req.body;

      const review = await this.productReviewsService.createReview({
        productId: Number(productId),
        userId,
        rating: Number(rating),
        comment,
      });

      return res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  };

  updateReview = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const { productId, rating, comment } = req.body;

      const review = await this.productReviewsService.updateReview({
        productId: Number(productId),
        userId,
        rating: Number(rating),
        comment,
      });

      return res.status(200).json(review);
    } catch (err) {
      next(err);
    }
  };

  deleteReview = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const reviewId = Number(req.params.id);
      const userId = req.user!.id;

      await this.productReviewsService.deleteReview({
        reviewId,
        userId,
      });

      return res.status(200).json({
        message: "Review deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
