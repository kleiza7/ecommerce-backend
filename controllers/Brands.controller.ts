import { Request, Response } from 'express';
import { Brand } from '../models/Brand.model';

export class BrandsController {
  async getAllBrands(_: Request, res: Response) {
    try {
      const brands = await Brand.findAll();

      res.status(200).json(brands);
    } catch (error) {
      res.status(404).json({ message: 'An error occurred when fetch brands.' });
    }
  }

  async getBrandById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const brand = await Brand.findByPk(id);

      if (!brand) {
        res.status(404).json({ message: 'Brand not found.' });
        return;
      }

      res.status(200).json(brand);
    } catch (error) {
      res.status(404).json({ message: 'An error occurred when fetch brand.' });
    }
  }

  async createBrand(req: Request, res: Response) {
    try {
      const { name } = req.body;

      const brand = await Brand.create({ name });

      res.status(201).json(brand);
    } catch (error) {
      res.status(404).json({ message: 'An error occurred.' });
    }
  }
}
