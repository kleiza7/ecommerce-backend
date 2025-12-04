import { Request, Response } from "express";
import { CategoriesService } from "../services/Categories.service";

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  getAllCategories = async (_: Request, res: Response) => {
    try {
      const categories = await this.categoriesService.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoriesService.getCategoryById(Number(id));

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch category" });
    }
  };

  getChildren = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const children = await this.categoriesService.getChildren(Number(id));

      return res.status(200).json(children);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const { name, parent_id, description, display_order } = req.body;

      if (!name || display_order === undefined) {
        return res
          .status(400)
          .json({ message: "name and display_order are required" });
      }

      const category = await this.categoriesService.createCategory(
        name,
        parent_id ?? null,
        description ?? null,
        display_order
      );

      if (!category) {
        return res.status(400).json({ message: "Invalid parent_id" });
      }

      return res.status(201).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create category" });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const updated = await this.categoriesService.updateCategory(
        Number(id),
        req.body
      );

      if (!updated) {
        return res
          .status(400)
          .json({ message: "Invalid update operation (id or parent invalid)" });
      }

      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to update category" });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await this.categoriesService.deleteCategory(Number(id));

      if (!deleted) {
        return res.status(400).json({
          message: "Category not found or cannot be deleted (has children)",
        });
      }

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete category" });
    }
  };
}
