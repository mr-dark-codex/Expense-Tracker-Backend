import { Router } from "express";
import { budgetAllocationValidators } from "../validators/budgetAllocation.validators";
import { validate } from "../middlewares/validator.middleware";
import { BudgetAllocationController } from "../controllers/budgetAllocation.controller";

const router = Router();
const controller = new BudgetAllocationController();

router.get("/", controller.getAll);
router.post(
  "/",
  budgetAllocationValidators.create,
  validate,
  controller.create,
);
router.put(
  "/:id",
  budgetAllocationValidators.update,
  validate,
  controller.update,
);
router.get(
  "/:id",
  budgetAllocationValidators.getById,
  validate,
  controller.getById,
);
router.delete(
  "/:id",
  budgetAllocationValidators.delete,
  validate,
  controller.delete,
);

export { router as budgetAllocationRouter };
