import { prisma } from "../services/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto } from "../types/category.types";

export class CategoryService {
  async create(data: CreateCategoryDto) {
    return await prisma.category.create({
      data: {
        categoryname: data.categoryname || "",
        description: data.description || "",
      },
    });
  }

  async getAll() {
    return await prisma.category.findMany({
      orderBy: { createdat: "desc" },
    });
  }

  async getById(id: string) {
    return await prisma.category.findUnique({
      where: { categoryid: id },
    });
  }

  async update(id: string, data: UpdateCategoryDto) {
    return await prisma.category.update({
      where: { categoryid: id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.category.delete({
      where: { categoryid: id },
    });
  }
}
