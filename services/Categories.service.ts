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

  async updateCategory(payload: {
    id: number;
    name: string;
    parentId: number | null;
    description: string | null;
    displayOrder: number;
  }) {
    const { id, name, parentId, description, displayOrder } = payload;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // 🔒 Parent validation (full update olduğu için her zaman çalışır)
    if (parentId !== null) {
      if (parentId === id) {
        throw new AppError("A category cannot be its own parent", 400);
      }

      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        throw new AppError("Parent category not found", 400);
      }
    }

    const slug = generateSlug(name);

    return prisma.category.update({
      where: { id },
      data: {
        name,
        parentId,
        description,
        displayOrder,
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

  /* ===========================
     SEARCH
  =========================== */

  async searchByName(query: string) {
    return prisma.category.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 5,
    });
  }
}
