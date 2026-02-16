import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";
import { OrdersService } from "../services/Orders.service";

export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  createOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;

      const order = await this.ordersService.createOrder(userId);

      return res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  };

  completePayment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orderId = Number(req.params.id);
      const userId = req.user!.id;

      await this.ordersService.completePayment(orderId, userId);

      return res.status(200).json({
        message: "Payment completed successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  cancelOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orderId = Number(req.params.id);
      const userId = req.user!.id;

      await this.ordersService.cancelOrder(orderId, userId);

      return res.status(200).json({
        message: "Order canceled successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  getOrdersListByUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;

      const orders = await this.ordersService.getOrdersListByUser(userId);

      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };

  getOrderById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orderId = Number(req.params.id);
      const userId = req.user!.id;

      const order = await this.ordersService.getOrderById(orderId, userId);

      return res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  };
}
