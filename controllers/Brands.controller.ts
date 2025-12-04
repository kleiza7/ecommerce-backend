import { Request, Response } from "express";
import { BrandsService } from "../services/Brands.service";

export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  getAllBrands = async (_: Request, res: Response) => {
    try {
      const brands = await this.brandsService.getAllBrands();
      return res.status(200).json(brands);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch brands" });
    }
  };

  getBrandById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const brand = await this.brandsService.getBrandById(id);

      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }

      return res.status(200).json(brand);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch brand" });
    }
  };

  createBrand = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      const brand = await this.brandsService.createBrand(name);
      return res.status(201).json(brand);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create brand" });
    }
  };

  updateBrand = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const updated = await this.brandsService.updateBrand(id, req.body);

      if (!updated) {
        return res.status(404).json({ message: "Brand not found" });
      }

      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update brand" });
    }
  };

  deleteBrand = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const deleted = await this.brandsService.deleteBrand(id);

      if (!deleted) {
        return res.status(404).json({ message: "Brand not found" });
      }

      return res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete brand" });
    }
  };
}
