import { Router } from "express";
import { transactionModeRouter } from "./transactionMode.routes";
import { categoryRouter } from "./category.routes";

import { HealthController } from "../controllers/health.controller";

const router = Router();
const healthController = new HealthController();

router.use("/transaction-modes", transactionModeRouter);
router.use("/category", categoryRouter);
router.get("/health", healthController.getHealth);

export { router as appRouter };
