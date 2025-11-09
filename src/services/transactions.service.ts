import { prisma } from "../services/prisma.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "../types/transactions.types";

export class TransactionsService {
  async create(data: CreateTransactionDto) {
    return await prisma.transactions.create({
      data: {
        amount: data.amount,
        modeid: data.modeid,
        categoryid: data.categoryid || null,
        transactiontype: data.transactiontype,
        description: data.description || null,
        transactiondate: data.transactiondate || new Date(),
      },
      include: {
        category: true,
        transactionmode: true,
      },
    });
  }

  async getAll() {
    return await prisma.transactions.findMany({
      include: {
        category: true,
        transactionmode: true,
      },
      orderBy: { createdat: "desc" },
    });
  }

  async getById(id: string) {
    return await prisma.transactions.findUnique({
      where: { transactionid: id },
      include: {
        category: true,
        transactionmode: true,
      },
    });
  }

  async update(id: string, data: UpdateTransactionDto) {
    return await prisma.transactions.update({
      where: { transactionid: id },
      data,
      include: {
        category: true,
        transactionmode: true,
      },
    });
  }

  async delete(id: string) {
    return await prisma.transactions.delete({
      where: { transactionid: id },
    });
  }
}
