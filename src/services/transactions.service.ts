import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../services/prisma.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "../types/transactions.types";

export class TransactionsService {
  async createv2(data: any) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate inside transaction to prevent race conditions
      await this.validateTransactionRules(data);

      // 2. Get fresh data within transaction
      const budgetAllocation = await this.getBudgetAllocationForCategory(data);
      const transactionMode = await tx.transactionmode.findUnique({
        where: { modeid: data.modeid },
      });

      if (!transactionMode) {
        throw new Error("Transaction mode not found");
      }

      // 3. Update allocations
      await tx.budgetallocation.update({
        where: { budgetallocationid: budgetAllocation.budgetallocationid },
        data: {
          allocatedamount: (budgetAllocation.allocatedamount || new Decimal(0))
            .sub(new Decimal(data.amount))
        },
      });

      await tx.transactionmode.update({
        where: { modeid: data.modeid },
        data: {
          amount: (transactionMode.amount || new Decimal(0))
            .sub(new Decimal(data.amount))
        },
      });

      // 4. Create transaction
      return await tx.transactions.create({
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
    });
  }


  async create(data: any) {

    // Handle other fields

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const startOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    console.log(data)

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
        createdat: 'desc', // latest first
      },
      take: 1, // limit 1
    });




    console.log("Budget Allocated List:", budgetAllocatedList);
    console.log(budgetAllocatedList[0].budget.amount)


    if (budgetAllocatedList.length === 0) {
      throw new Error("No budget allocation found for this category in the current month.");
    }

    // const totalAllocatedAmount = budgetAllocatedList[0]?.allocatedamount ?? new Decimal(0); // fallback to 0
    // budgetAllocatedList[0].allocatedamount = totalAllocatedAmount.sub(new Decimal(data?.amount ?? 0));





    // const current = new Decimal(budgetAllocatedList[0].allocatedamount);
    // const amountToSubtract = new Decimal(data.amount);

    // // Subtract safely using Decimal math
    // budgetAllocatedList[0].allocatedamount = current.sub(amountToSubtract);

    // return await prisma.transactions.create({
    //   data: {
    //     amount: data.amount,
    //     modeid: data.modeid,
    //     categoryid: data.categoryid || null,
    //     transactiontype: data.transactiontype,
    //     description: data.description || null,
    //     transactiondate: data.transactiondate || new Date(),
    //   },
    //   include: {
    //     category: true,
    //     transactionmode: true,
    //   },
    // });

    return { message: "Functionality under development" };
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

  private async validateTransactionRules(data: any) {
    const validations = await Promise.all([
      // Add validation rules here
      this.validateBudgetLimit(data),
      this.validateAllocationLimit(data),
      this.validateTransactionModeAmount(data)
      // this.validateMonthlySpending(data)
    ]);
  }

  private async validateAllocationLimit(data: any) {
    const allocation = await this.getBudgetAllocationForCategory(data);

    // Keep as Decimal objects and use Decimal methods
    const allocatedAmount = allocation?.allocatedamount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    console.log(`Validating allocation limit: Transaction Amount = ${transactionAmount}, Allocated Amount = ${allocatedAmount}`);

    // Use Decimal.greaterThan() method
    if (transactionAmount.greaterThan(allocatedAmount)) {
      throw new Error(`Transaction amount (${transactionAmount}) exceeds allocated budget (${allocatedAmount})`);
    }
  }

  private async validateBudgetLimit(data: any) {
    const budget = await this.getBudgetForCategory(data);

    const budgetAmount = budget?.amount || new Decimal(0);
    const transactionAmount = new Decimal(data.amount || 0);

    if (transactionAmount.greaterThan(budgetAmount)) {
      throw new Error(`Transaction amount (${transactionAmount}) exceeds budget limit (${budgetAmount})`);
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

    if (transactionAmount.greaterThan(modeAmount)) {
      throw new Error(`Transaction amount exceeds Transaction mode limit`);
    }
  }



  private async validateMonthlySpendingLimit(data: any) {
    // 
  }

  private async getBudgetForCategory(data: any) {

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const startOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

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
        createdat: 'desc', // latest first
      },
      take: 1, // limit 1
    });

    if (budgetAllocatedList.length == 0) {
      throw new Error("No budget allocation found for this category in the current month.");
    }

    return budgetAllocatedList[0].budget;


  }

  private async getBudgetAllocationForCategory(data: any) {

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const startOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

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
        createdat: 'desc', // latest first
      },
      take: 1, // limit 1
    });

    if (budgetAllocatedList.length == 0) {
      throw new Error("No budget allocation found for this category in the current month.");
    }

    return budgetAllocatedList[0];
  }

}
