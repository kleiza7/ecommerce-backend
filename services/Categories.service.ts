import { Category } from "../models/Category.model";
import { generateSlug } from "../utils/Slug.util";

export class CategoriesService {
  async getAllCategories() {
    return Category.findAll({ order: [["display_order", "ASC"]] });
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

  async createCategory(
    name: string,
    parent_id: number | null,
    description: string | null,
    display_order: number
  ) {
    const slug = generateSlug(name);

    // Parent kontrolü (HAM CRUD)
    if (parent_id) {
      const parent = await Category.findByPk(parent_id);
      if (!parent) {
        return null; // Controller bunu yakalayıp 400 dönecek
      }
    }

    const category = await Category.create({
      name,
      slug,
      parent_id,
      description,
      display_order,
    });

    return category;
  }

  async updateCategory(id: number, data: Partial<Category>) {
    const category = await Category.findByPk(id);
    if (!category) return null;

    // parent değiştirilmişse
    if (data.parent_id !== undefined && data.parent_id !== null) {
      // kendi kendine parent olamaz
      if (data.parent_id === id) {
        return null;
      }

      const parent = await Category.findByPk(data.parent_id);
      if (!parent) return null;
    }

    // isim güncelleniyorsa slug'ı da güncelle
    if (data.name) {
      data.slug = generateSlug(data.name);
    }

    await category.update(data);
    return category;
  }

  async deleteCategory(id: number) {
    const category = await Category.findByPk(id);
    if (!category) return false;

    // Alt kategori varsa silme
    const child = await Category.findOne({ where: { parent_id: id } });
    if (child) {
      return false;
    }

    await category.destroy();
    return true;
  }
}
