import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { generateSlug } from "../utils/Slug.util";

export class CategoriesService {
  /**
   * Flat + ordered category list
   * Frontend builds the tree
   */
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: [{ parentId: "asc" }, { displayOrder: "asc" }],
    });
  }

  async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  async createCategory(data: {
    name: string;
    parentId: number | null;
    description: string | null;
    displayOrder: number;
  }) {
    const { name, parentId, description, displayOrder } = data;
    const slug = generateSlug(name);

    if (parentId !== null) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        throw new AppError("Parent category not found", 400);
      }
    }

    return prisma.category.create({
      data: {
        name,
        slug,
        parentId,
        description,
        displayOrder,
      },
    });
  }

  async updateCategory(
    id: number,
    data: {
      name?: string;
      parentId?: number | null;
      description?: string | null;
      displayOrder?: number;
    }
  ) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (data.parentId !== undefined && data.parentId !== null) {
      if (data.parentId === id) {
        throw new AppError("A category cannot be its own parent", 400);
      }

      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new AppError("Parent category not found", 400);
      }
    }

    const slug = data.name ? generateSlug(data.name) : undefined;

    return prisma.category.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });
  }

  async deleteCategory(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const hasChildren = await prisma.category.findFirst({
      where: { parentId: id },
    });

    if (hasChildren) {
      throw new AppError(
        "Category has child categories and cannot be deleted",
        400
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return true;
  }
}
