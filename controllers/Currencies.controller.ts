import { NextFunction, Request, Response } from "express";
import { CurrencyService } from "../services/Currencies.service";

export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  getAllCurrencies = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const currencies = await this.currencyService.getAllCurrencies();
      return res.status(200).json(currencies);
    } catch (error) {
      next(error);
    }
  };

  getCurrencyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const currency = await this.currencyService.getCurrencyById(id);
      return res.status(200).json(currency);
    } catch (error) {
      next(error);
    }
  };

  createCurrency = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, symbol } = req.body;

      const currency = await this.currencyService.createCurrency({
        code,
        symbol,
      });

      return res.status(201).json(currency);
    } catch (error) {
      next(error);
    }
  };

  updateCurrency = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, code, symbol } = req.body;

      const updatedCurrency = await this.currencyService.updateCurrency({
        id,
        code,
        symbol,
      });

      return res.status(200).json(updatedCurrency);
    } catch (error) {
      next(error);
    }
  };

  deleteCurrency = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.currencyService.deleteCurrency(id);

      return res.status(200).json({ message: "Currency deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
