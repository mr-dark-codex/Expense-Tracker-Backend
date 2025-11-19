import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../services/prisma.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "../types/transactions.types";
import { Prisma } from "generated/prisma/client";
import { CustomError } from "../utils/customError";

export class TransactionsService {
  async createv2(data: any, tx?: Prisma.TransactionClient) {
    const executeTransaction = async (txClient: Prisma.TransactionClient) => {
      // 1. Validate inside transaction
      if (data.transactiontype === "DEBIT") {
        await this.validateTransactionRulesWithTx(data, txClient);
      }

      // 2. Get and update transaction mode
      const transactionMode = await txClient.transactionmode.findUnique({
        where: { modeid: data.modeid },
      });

      if (!transactionMode) {
        throw new Error("Transaction mode not found");
      }

      const currentAmount = transactionMode.amount || new Decimal(0);
      const transactionAmount = new Decimal(data.amount);

      const newAmount =
        data.transactiontype === "DEBIT"
          ? currentAmount.sub(transactionAmount)
          : currentAmount.add(transactionAmount);

      await txClient.transactionmode.update({
        where: { modeid: data.modeid },
        data: { amount: newAmount },
      });

      // 3. Create transaction
      return await txClient.transactions.create({
        data: {
          amount: data.amount,
          modeid: data.modeid,
          categoryid: data.categoryid || null,
          transactiontype: data.transactiontype,
          description: data.description || null,
          transactiondate: data.transactiondate || new Date(),
          status: "COMPLETED",
        },
        include: {
          category: true,
          transactionmode: true,
        },
      });
    };

    // Use provided transaction or create new one
    return tx
      ? executeTransaction(tx)
      : prisma.$transaction(executeTransaction);
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

  async getTotalSpentByCategoryInCurrentMonth(categoryId: string) {
    return await this.getMonthlySpentByCategory(categoryId);
  }

  private async validateTransactionRulesWithTx(
    data: any,
    tx: Prisma.TransactionClient,
  ) {
    // Validates in order, stops at first error
    await this.validateBudgetLimitWithTx(data, tx);
    await this.validateAllocationLimitWithTx(data, tx);
    await this.validateTransactionModeAmountWithTx(data, tx);
  }

  private async validateAllocationLimitWithTx(
    data: any,
    tx: Prisma.TransactionClient,
  ) {
    const allocation = await this.getBudgetAllocationForCategoryWithTx(
      data,
      tx,
    );

    const allocatedAmount = allocation?.allocatedamount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    if (transactionAmount.greaterThan(allocatedAmount)) {
      throw new CustomError(
        `Transaction amount (${transactionAmount}) exceeds allocated budget (${allocatedAmount})`,
        400,
        ["Allocation Limit Exceeded"],
      );
    }
  }

  private async validateBudgetLimitWithTx(
    data: any,
    tx: Prisma.TransactionClient,
  ) {
    const budget = await this.getBudgetForCategoryWithTx(data, tx);

    const budgetAmount = budget?.amount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    if (transactionAmount.greaterThan(budgetAmount)) {
      throw new CustomError(
        `Transaction amount (${transactionAmount}) exceeds budget limit (${budgetAmount})`,
        400,
        ["Budget Limit Exceeded"],
      );
    }
  }

  private async validateTransactionModeAmountWithTx(
    data: any,
    tx: Prisma.TransactionClient,
  ) {
    const mode = await tx.transactionmode.findUnique({
      where: { modeid: data.modeid },
    });

    if (!mode) {
      throw new CustomError("Invalid transaction mode", 400, ["Invalid Mode"]);
    }

    const modeAmount = mode?.amount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    if (
      data.transactiontype === "DEBIT" &&
      transactionAmount.greaterThan(modeAmount)
    ) {
      throw new CustomError(
        `Insufficient balance. Available: ${modeAmount}, Required: ${transactionAmount}`,
        400,
        ["Insufficient Balance"],
      );
    }
  }

  private async getBudgetForCategoryWithTx(
    data: any,
    tx: Prisma.TransactionClient,
  ) {
    const { startOfMonth, startOfNextMonth } = this.getCurrentMonthRange();

    const budgetAllocation = await tx.budgetallocation.findFirst({
      where: {
        categoryid: data.categoryid,
        createdat: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      include: { budget: true },
      orderBy: { createdat: "desc" },
    });

    if (!budgetAllocation) {
      throw new CustomError(
        "No budget allocation found for this category in the current month.",
        400,
        ["Budget Allocation Missing"],
      );
    }

    return budgetAllocation.budget;
  }

  private async getBudgetAllocationForCategoryWithTx(
    data: any,
    tx: Prisma.TransactionClient,
  ) {
    const { startOfMonth, startOfNextMonth } = this.getCurrentMonthRange();

    const budgetAllocation = await tx.budgetallocation.findFirst({
      where: {
        categoryid: data.categoryid,
        createdat: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      include: { budget: true },
      orderBy: { createdat: "desc" },
    });

    if (!budgetAllocation) {
      throw new CustomError(
        "No budget allocation found for this category in the current month.",
        400,
        ["Budget Allocation Missing"],
      );
    }

    return budgetAllocation;
  }

  private getCurrentMonthRange() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { startOfMonth, startOfNextMonth };
  }

  private async getMonthlySpentByCategory(categoryId: string) {
    const { startOfMonth, startOfNextMonth } = this.getCurrentMonthRange();

    const totalAmount = await prisma.transactions.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        categoryid: categoryId,
        transactiondate: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
    });

    return totalAmount._sum.amount || new Decimal(0);
  }
}
