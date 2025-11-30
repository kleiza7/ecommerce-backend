import { Request, Response } from "express";
import { BrandsService } from "../services/Brands.service";

export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  getAllBrands = async (_: Request, res: Response) => {
    try {
      const brands = await this.brandsService.getAllBrands();
      res.status(200).json(brands);
    } catch (error) {
      res.status(404).json({ message: "An error occurred when fetch brands." });
    }
  };

  getBrandById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const brand = await this.brandsService.getBrandById(id);

      if (!brand) {
        res.status(404).json({ message: "Brand not found." });
        return;
      }

      res.status(200).json(brand);
    } catch (error) {
      res.status(404).json({ message: "An error occurred when fetch brand." });
    }
  };

  createBrand = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      const brand = await this.brandsService.createBrand(name);

      res.status(201).json(brand);
    } catch (error) {
      res.status(404).json({ message: "An error occurred." });
    }
  };
}
