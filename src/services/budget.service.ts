import { prisma } from "../services/prisma.service";
import { CreateBudgetDto, UpdateBudgetDto } from "../types/budget.types";

export class BudgetService {
  async create(data: CreateBudgetDto) {
    return await prisma.budget.create({
      data: {
        amount: data.amount || 0,
        startdate: data.startdate ? new Date(data.startdate) : null,
        enddate: data.enddate ? new Date(data.enddate) : null,
      },
    });
  }

  async getAll() {
    return await prisma.budget.findMany({
      orderBy: { createdat: "desc" },
    });
  }

  async getById(id: string) {
    return await prisma.budget.findUnique({
      where: { budgetid: id },
    });
  }

  async update(id: string, data: UpdateBudgetDto) {
    const updateData: any = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.startdate) updateData.startdate = new Date(data.startdate);
    if (data.enddate) updateData.enddate = new Date(data.enddate);

    return await prisma.budget.update({
      where: { budgetid: id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return await prisma.budget.delete({
      where: { budgetid: id },
    });
  }
}
