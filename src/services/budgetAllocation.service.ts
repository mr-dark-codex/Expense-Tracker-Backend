import { prisma } from "../services/prisma.service";
import {
  CreateBudgetAllocationDto,
  UpdateBudgetAllocationDto,
} from "../types/budgetAllocation.types";

export class BudgetAllocationService {
  async create(data: CreateBudgetAllocationDto) {
    return await prisma.budgetallocation.create({
      data: {
        budgetid: data.budgetid,
        categoryid: data.categoryid,
        allocatedamount: data.allocatedamount || 0,
        description: data.description || "",
      },
      include: {
        budget: true,
        category: true,
      },
    });
  }

  async getAll() {
    return await prisma.budgetallocation.findMany({
      include: {
        budget: true,
        category: true,
      },
      orderBy: { createdat: "desc" },
    });
  }

  async getById(id: string) {
    return await prisma.budgetallocation.findUnique({
      where: { budgetallocationid: id },
      include: {
        budget: true,
        category: true,
      },
    });
  }

  async update(id: string, data: UpdateBudgetAllocationDto) {
    return await prisma.budgetallocation.update({
      where: { budgetallocationid: id },
      data,
      include: {
        budget: true,
        category: true,
      },
    });
  }

  async delete(id: string) {
    return await prisma.budgetallocation.delete({
      where: { budgetallocationid: id },
    });
  }
}
