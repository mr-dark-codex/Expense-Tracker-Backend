import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../services/prisma.service";
import {
  CreateOtherPaymentDto,
  UpdateOtherPaymentDto,
} from "../types/otherPayments.types";
import { TransactionsService } from "./transactions.service";
import { Prisma } from "generated/prisma/client";
import { CustomError } from "../utils/customError";

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

  async createWithTx(data: any, tx: Prisma.TransactionClient) {
    return await tx.otherpayments.create({
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

  async updatePaidAmount(
    otherpaymentid: string,
    paidamount: string,
    tx?: Prisma.TransactionClient,
  ) {
    const executeUpdate = async (txClient: Prisma.TransactionClient) => {
      const otherpayment = await txClient.otherpayments.findUnique({
        where: { otherpaymentid },
        include: { category: true },
      });

      if (!otherpayment) {
        throw new CustomError("Other payment not found", 404, ["Invalid ID"]);
      }

      const prevAmount = otherpayment.paidamount || new Decimal(0);
      const newPaidAmount = prevAmount.add(paidamount);

      if (prevAmount.equals(newPaidAmount)) {
        return otherpayment;
      }

      // Validate payment doesn't exceed total amount
      if (newPaidAmount.greaterThan(otherpayment?.amount ?? new Decimal(0))) {
        throw new CustomError("Paid amount cannot exceed total amount", 400, [
          "Invalid paid amount",
        ]);
        // throw new Error("Paid amount cannot exceed total amount");
      }

      return await txClient.otherpayments.update({
        where: { otherpaymentid },
        data: { paidamount: newPaidAmount },
        include: { category: true },
      });
    };

    return tx ? executeUpdate(tx) : prisma.$transaction(executeUpdate);
  }

  async delete(id: string) {
    return await prisma.otherpayments.delete({
      where: { otherpaymentid: id },
    });
  }
}
