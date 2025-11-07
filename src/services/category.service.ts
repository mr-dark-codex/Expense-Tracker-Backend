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
}
