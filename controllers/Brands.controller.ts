import { NextFunction, Request, Response } from "express";
import { BrandsService } from "../services/Brands.service";

export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  getAllBrands = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const brands = await this.brandsService.getAllBrands();
      return res.status(200).json(brands);
    } catch (error) {
      next(error);
    }
  };

  getBrandById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const brand = await this.brandsService.getBrandById(id);
      return res.status(200).json(brand);
    } catch (error) {
      next(error);
    }
  };

  createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const brand = await this.brandsService.createBrand(name);

      return res.status(201).json(brand);
    } catch (error) {
      next(error);
    }
  };

  updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updatedBrand = await this.brandsService.updateBrand(id, req.body);

      return res.status(200).json(updatedBrand);
    } catch (error) {
      next(error);
    }
  };

  deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.brandsService.deleteBrand(id);

      return res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
