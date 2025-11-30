import { Category } from "../models/Category.model";
import { generateSlug } from "../utils/Slug.util";

export class CategoriesService {
  async createCategory(
    name: string,
    parent_id: number | null,
    description: string | null,
    display_order: number
  ) {
    const slug = generateSlug(name);

    return Category.create({
      name,
      slug,
      parent_id,
      description,
      display_order,
    });
  }

  async getAllCategories() {
    return Category.findAll({
      order: [["display_order", "ASC"]],
    });
  }

  async getCategoryById(id: number) {
    return Category.findByPk(id);
  }

  async getChildren(id: number) {
    return Category.findAll({
      where: { parent_id: id },
      order: [["display_order", "ASC"]],
    });
  }

  async updateCategory(
    id: number,
    data: Partial<{
      name: string;
      slug: string;
      parent_id: number | null;
      description: string | null;
      display_order: number;
    }>
  ) {
    if (data.name) {
      data.slug = generateSlug(data.name);
    }

    await Category.update(data, { where: { id } });

    return this.getCategoryById(id);
  }

  async deleteCategory(id: number) {
    return Category.destroy({ where: { id } });
  }
}
