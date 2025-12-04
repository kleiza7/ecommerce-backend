import { AppError } from "../errors/AppError";
import { Category } from "../models/Category.model";
import { generateSlug } from "../utils/Slug.util";

export class CategoriesService {
  async getAllCategories() {
    return Category.findAll({
      order: [["display_order", "ASC"]],
    });
  }

  async getCategoryById(id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  async getChildren(id: number) {
    return Category.findAll({
      where: { parent_id: id },
      order: [["display_order", "ASC"]],
    });
  }

  async createCategory(
    name: string,
    parent_id: number | null,
    description: string | null,
    display_order: number
  ) {
    const slug = generateSlug(name);

    // parent valid mi?
    if (parent_id) {
      const parent = await Category.findByPk(parent_id);
      if (!parent) {
        throw new AppError("Parent category not found", 400);
      }
    }

    return Category.create({
      name,
      slug,
      parent_id,
      description,
      display_order,
    });
  }

  async updateCategory(id: number, data: Partial<Category>) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // parent değişiyor mu?
    if (data.parent_id !== undefined && data.parent_id !== null) {
      if (data.parent_id === id) {
        throw new AppError("A category cannot be its own parent", 400);
      }

      const parent = await Category.findByPk(data.parent_id);
      if (!parent) {
        throw new AppError("Parent category not found", 400);
      }
    }

    // name güncellenmişse slug da güncellenir
    if (data.name) {
      data.slug = generateSlug(data.name);
    }

    await category.update(data);
    return category;
  }

  async deleteCategory(id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const child = await Category.findOne({
      where: { parent_id: id },
    });

    if (child) {
      throw new AppError("Category has children and cannot be deleted", 400);
    }

    await category.destroy();
    return true;
  }
}
