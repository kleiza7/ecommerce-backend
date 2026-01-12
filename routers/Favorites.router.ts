import { Router } from "express";
import { FavoritesController } from "../controllers/Favorites.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  mergeGuestFavoritesSchema,
  toggleFavoriteSchema,
} from "../schemas/Favorites.schema";

export class FavoritesRouter {
  constructor(private router: Router, private controller: FavoritesController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    /**
     * GET FAVORITES
     */
    this.router.get(
      "/get-favorites-list-by-user",
      verifyToken,
      checkRole(USER_ROLE.USER),
      this.controller.getFavoritesListByUser
    );

    /**
     * TOGGLE FAVORITE
     */
    this.router.post(
      "/toggle-favorite",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(toggleFavoriteSchema),
      this.controller.toggleFavorite
    );

    /**
     * MERGE GUEST FAVORITES (LOGIN SONRASI)
     */
    this.router.post(
      "/merge",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(mergeGuestFavoritesSchema),
      this.controller.mergeGuestFavorites
    );
  }

  public getRouter() {
    return this.router;
  }
}
