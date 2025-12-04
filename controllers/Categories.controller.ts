import { NextFunction, Request, Response } from "express";
import { CategoriesService } from "../services/Categories.service";

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  getAllCategories = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoriesService.getAllCategories();
      return res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const category = await this.categoriesService.getCategoryById(id);
      return res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  };

  getChildren = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const children = await this.categoriesService.getChildren(id);
      return res.status(200).json(children);
    } catch (err) {
      next(err);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, parent_id, description, display_order } = req.body;

      const category = await this.categoriesService.createCategory(
        name,
        parent_id ?? null,
        description ?? null,
        display_order
      );

      return res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updated = await this.categoriesService.updateCategory(id, req.body);
      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      await this.categoriesService.deleteCategory(id);

      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
