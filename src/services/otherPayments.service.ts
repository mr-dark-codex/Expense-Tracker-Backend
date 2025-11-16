import { prisma } from "../services/prisma.service";
import {
  CreateOtherPaymentDto,
  UpdateOtherPaymentDto,
} from "../types/otherPayments.types";
import { TransactionsService } from "./transactions.service";

export class OtherPaymentsService {
  // private transactionsService = new TransactionsService();
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

  async update(id: string, data: any) {
    return await prisma.otherpayments.update({
      where: { otherpaymentid: id },
      data,
      include: {
        category: true,
      },
    });
  }

  async updatePaidAmount(id: string, paidamount: string) {
    return await prisma.otherpayments.update({
      where: { otherpaymentid: "781329f6-7d63-4710-85b2-31ed8576d6f6" },
      data: { paidamount },
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
