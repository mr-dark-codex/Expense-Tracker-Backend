import { prisma } from "../services/prisma.service";
import {
  CreateTransactionModeDto,
  UpdateTransactionModeDto,
} from "../types/transactionMode.types";
import { Logger, loggers } from "winston";

export class TransactionModeService {
  async create(data: CreateTransactionModeDto) {
    return await prisma.transactionmode.create({
      data: {
        modename: data.modename,
        amount: data.amount,
        currency: data.currency || "RUPEES",
        description: data.description,
      },
    });
  }

  async findAll() {
    return await prisma.transactionmode.findMany({
      select: {
        modeid: true,
        modename: true,
        amount: true,
        currency: true,
        description: true,
      },
      orderBy: { createdat: "desc" },
    });
  }

  async findById(id: string) {
    return await prisma.transactionmode.findUnique({
      where: { modeid: id }
    });
  }

  async update(id: string, data: UpdateTransactionModeDto) {
    return await prisma.transactionmode.update({
      where: { modeid: id },
      data: {
        ...data,
        updatedat: new Date(),
      },
      select: {
        modeid: true,
        modename: true,
        amount: true,
        currency: true,
        description: true,
      }
    });
  }

  async delete(id: string) {
    return await prisma.transactionmode.delete({
      where: { modeid: id },
    });
  }
}
