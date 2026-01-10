import { Router } from "express";
import { CurrenciesController } from "../controllers/Currencies.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  createCurrencySchema,
  currencyIdParamSchema,
  updateCurrencySchema,
} from "../schemas/Currencies.schema";

export class CurrenciesRouter {
  constructor(
    private router: Router,
    private controller: CurrenciesController
  ) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/get-all", this.controller.getAllCurrencies);

    this.router.get(
      "/get-by-id/:id",
      validate(currencyIdParamSchema),
      this.controller.getCurrencyById
    );

    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(createCurrencySchema),
      this.controller.createCurrency
    );

    this.router.put(
      "/update",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(updateCurrencySchema),
      this.controller.updateCurrency
    );

    this.router.delete(
      "/delete/:id",
      verifyToken,
      checkRole(USER_ROLE.SELLER),
      validate(currencyIdParamSchema),
      this.controller.deleteCurrency
    );
  }

  public getRouter() {
    return this.router;
  }
}
