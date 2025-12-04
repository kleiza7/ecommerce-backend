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
      const id = Number(req.params.id);
      const category = await this.categoriesService.getCategoryById(id);

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
      const id = Number(req.params.id);
      const children = await this.categoriesService.getChildren(id);
      return res.status(200).json(children);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const { name, parent_id, description, display_order } = req.body;

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
      const id = Number(req.params.id);

      const updated = await this.categoriesService.updateCategory(id, req.body);

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
      const id = Number(req.params.id);

      const deleted = await this.categoriesService.deleteCategory(id);

      if (!deleted) {
        return res.status(400).json({
          message:
            "Category not found or cannot be deleted because it has children",
        });
      }

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete category" });
    }
  };
}
