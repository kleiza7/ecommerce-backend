import { Router } from "express";
import { OrdersController } from "../controllers/Orders.controller";
import { USER_ROLE } from "../enums/UserRole.enum";
import { checkRole } from "../middlewares/checkRole.middleware";
import { validate } from "../middlewares/validate.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import {
  createOrderSchema,
  orderIdParamSchema,
} from "../schemas/Orders.schema";

export class OrdersRouter {
  constructor(private router: Router, private controller: OrdersController) {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/create",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(createOrderSchema),
      this.controller.createOrder
    );

    this.router.post(
      "/complete-payment/:id",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(orderIdParamSchema),
      this.controller.completePayment
    );

    this.router.post(
      "/cancel/:id",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(orderIdParamSchema),
      this.controller.cancelOrder
    );

    this.router.get(
      "/get-orders-list-by-user",
      verifyToken,
      checkRole(USER_ROLE.USER),
      this.controller.getOrdersListByUser
    );

    this.router.get(
      "/get-by-id/:id",
      verifyToken,
      checkRole(USER_ROLE.USER),
      validate(orderIdParamSchema),
      this.controller.getOrderById
    );
  }

  public getRouter() {
    return this.router;
  }
}
