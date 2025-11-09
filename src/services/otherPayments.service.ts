import { prisma } from "../services/prisma.service";
import {
  CreateOtherPaymentDto,
  UpdateOtherPaymentDto,
} from "../types/otherPayments.types";

export class OtherPaymentsService {
  async create(data: CreateOtherPaymentDto) {
    return await prisma.otherpayments.create({
      data: {
        categoryid: data.categoryid || null,
        amount: data.amount || null,
        paidamount: data.paidamount || null,
        description: data.description || null,
      },
      include: {
        category: true,
      },
    });
  }

  async getAll() {
    return await prisma.otherpayments.findMany({
      include: {
        category: true,
      },
      orderBy: { createdat: "desc" },
    });
  }

  async getById(id: string) {
    return await prisma.otherpayments.findUnique({
      where: { otherpaymentid: id },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: UpdateOtherPaymentDto) {
    return await prisma.otherpayments.update({
      where: { otherpaymentid: id },
      data,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    return await prisma.otherpayments.delete({
      where: { otherpaymentid: id },
    });
  }
}
