import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";
import { FavoritesService } from "../services/Favorites.service";

export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  getFavoritesListByUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;

      const favorites =
        await this.favoritesService.getFavoritesListByUser(userId);

      return res.status(200).json(favorites);
    } catch (err) {
      next(err);
    }
  };

  toggleFavorite = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const { productId } = req.body;

      const result = await this.favoritesService.toggleFavorite({
        userId,
        productId,
      });

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  mergeGuestFavorites = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const { productIds } = req.body as { productIds: number[] };

      const merged = await this.favoritesService.mergeGuestFavorites(
        userId,
        productIds,
      );

      return res.status(200).json(merged);
    } catch (err) {
      next(err);
    }
  };
}
