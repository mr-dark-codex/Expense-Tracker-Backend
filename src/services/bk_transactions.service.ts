import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../services/prisma.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "../types/transactions.types";
import { OtherPaymentsService } from "./otherPayments.service";
import { Prisma } from "generated/prisma/client";

export class TransactionsService {
  async createv2(data: any) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate inside transaction to prevent race conditions
      if (data.transactiontype === "DEBIT") {
        await this.validateTransactionRules(data);
      }

      // if (data.otherspayment == true && data.transactiontype === "CREDIT") {
      //   await this.otherPaymentsService.updatePaidAmount(
      //     data.categoryid,
      //     data.amount,
      //   );
      // }

      // 2. Get fresh data within transaction
      // const budgetAllocation = await this.getBudgetAllocationForCategory(data);
      const transactionMode = await tx.transactionmode.findUnique({
        where: { modeid: data.modeid },
      });

      if (!transactionMode) {
        throw new Error("Transaction mode not found");
      }

      // 3. Update allocations
      /**
       * Do not change budget allocation, why we would change budget allocation,
       * if we want to show how much expensed against allocation, we should keep allocated amount constant
       * and sum up the transactions against that allocation to show how much is spent within this month.
       *
       */
      // await tx.budgetallocation.update({
      //   where: { budgetallocationid: budgetAllocation.budgetallocationid },
      //   data: {
      //     allocatedamount: (budgetAllocation.allocatedamount || new Decimal(0))
      //       .sub(new Decimal(data.amount))
      //   },
      // });

      if (data.transactiontype === "DEBIT") {
        // For DEBIT transactions, we need to subtract the amount from the transaction mode
        await tx.transactionmode.update({
          where: { modeid: data.modeid },
          data: {
            amount: (transactionMode.amount || new Decimal(0)).sub(
              new Decimal(data.amount),
            ),
          },
        });
      } else if (data.transactiontype === "CREDIT") {
        // For CREDIT transactions, we need to add back the amount to the transaction mode
        await tx.transactionmode.update({
          where: { modeid: data.modeid },
          data: {
            amount: (transactionMode.amount || new Decimal(0)).add(
              new Decimal(data.amount),
            ),
          },
        });
      }

      // 4. Create transaction
      return await tx.transactions.create({
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
    });
  }

  async createv3Withtx(data: any, tx: Prisma.TransactionClient) {
    
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

  /**
   *
   * @param CreateTransactionDto data
   * @returns Promise<void>
   * @description Validates transaction rules non-sequentially that if error occurs, which occur first, it is captured.
   * But if one validation fails, the subsequent validations are executed.
   * This approach provides comprehensive feedback on all potential issues with the transaction data.
   */

  // private async validateTransactionRules(data: any) {
  //   const validations = await Promise.all([
  //     // Add validation rules here
  //     this.validateBudgetLimit(data),
  //     this.validateAllocationLimit(data),
  //     this.validateTransactionModeAmount(data),
  //     // this.validateMonthlySpending(data)
  //   ]);
  // }

  /**
   * @param CreateTransactionDto data
   * @returns Promise<void>
   * @description Validates transaction rules are sequentially, stops at first error.
   */

  private async validateTransactionRules(data: any) {
    // Validates in order, stops at first error
    await this.validateBudgetLimit(data);
    await this.validateAllocationLimit(data);
    await this.validateTransactionModeAmount(data);
  }

  private async validateAllocationLimit(data: any) {
    const allocation = await this.getBudgetAllocationForCategory(data);

    // Keep as Decimal objects and use Decimal methods
    const allocatedAmount = allocation?.allocatedamount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    console.log(
      `Validating allocation limit: Transaction Amount = ${transactionAmount}, Allocated Amount = ${allocatedAmount}`,
    );
    console.log(
      "transactionAmount.greaterThan(allocatedAmount) : ",
      transactionAmount.greaterThan(allocatedAmount),
    );

    // Use Decimal.greaterThan() method
    if (transactionAmount.greaterThan(allocatedAmount)) {
      throw new Error(
        `Transaction amount (${transactionAmount}) exceeds allocated budget (${allocatedAmount})`,
      );
    }
  }

  async getTotalSpentByCategoryInCurrentMonth(categoryId: string) {
    return await this.getMonthlySpentByCateogry(categoryId);
  }

  private async validateBudgetLimit(data: any) {
    const budget = await this.getBudgetForCategory(data);

    const budgetAmount = budget?.amount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    console.log(
      `Validating allocation limit: Transaction Amount = ${transactionAmount}, budget Amount = ${budgetAmount}`,
    );

    if (transactionAmount.greaterThan(budgetAmount)) {
      throw new Error(
        `Transaction amount (${transactionAmount}) exceeds budget limit (${budgetAmount})`,
      );
    }
  }

  private async validateTransactionModeAmount(data: any) {
    const mode = await prisma.transactionmode.findUnique({
      where: { modeid: data.modeid },
    });

    if (!mode) {
      throw new Error("Invalid transaction mode");
    }

    const modeAmount = mode?.amount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    console.log(
      `Validating allocation limit: Transaction Amount = ${transactionAmount}, Mode Amount = ${modeAmount}`,
    );

    if (transactionAmount.greaterThan(modeAmount)) {
      throw new Error(`Transaction amount exceeds Transaction mode limit`);
    }
  }

  private async validateMonthlySpendingLimit(data: any) {
    //
  }

  private async getBudgetForCategory(data: any) {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const startOfNextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
    );

    const budgetAllocatedList = await prisma.budgetallocation.findMany({
      where: {
        categoryid: data.categoryid,
        createdat: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      include: {
        budget: true, // 👈 include the related budget
      },
      orderBy: {
        createdat: "desc", // latest first
      },
      take: 1, // limit 1
    });

    if (budgetAllocatedList.length == 0) {
      throw new Error(
        "No budget allocation found for this category in the current month.",
      );
    }

    return budgetAllocatedList[0].budget;
  }

  private async getBudgetAllocationForCategory(data: any) {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const startOfNextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1,
    );

    const budgetAllocatedList = await prisma.budgetallocation.findMany({
      where: {
        categoryid: data.categoryid,
        createdat: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      include: {
        budget: true, // 👈 include the related budget
      },
      orderBy: {
        createdat: "desc", // latest first
      },
      take: 1, // limit 1
    });

    if (budgetAllocatedList.length == 0) {
      throw new Error(
        "No budget allocation found for this category in the current month.",
      );
    }

    return budgetAllocatedList[0];
  }

  private async getMonthlySpentByCateogry(categoryId: string) {
    const totalAmount = await prisma.transactions.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        categoryid: categoryId,
        transactiondate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    return totalAmount._sum.amount || new Decimal(0);
  }
}
