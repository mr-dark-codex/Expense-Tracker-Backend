import { Router } from "express";
import { transactionModeRouter } from "./transactionMode.routes";
import { categoryRouter } from "./category.routes";
import { budgetRouter } from "./budget.routes";
import { budgetAllocationRouter } from "./budgetAllocation.routes";
import { otherPaymentsRouter } from "./otherPayments.routes";
import { transactionsRouter } from "./transactions.routes";

import { HealthController } from "../controllers/health.controller";

const router = Router();
const healthController = new HealthController();

router.use("/transaction-modes", transactionModeRouter);
router.use("/category", categoryRouter);
router.use("/budget", budgetRouter);
router.use("/budget-allocations", budgetAllocationRouter);
router.use("/other-payments", otherPaymentsRouter);
router.use("/transactions", transactionsRouter);
router.get("/health", healthController.getHealth);

export { router as appRouter };
