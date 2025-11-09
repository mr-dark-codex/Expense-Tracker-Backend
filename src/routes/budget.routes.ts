import { Router } from "express";
import { budgetValidators } from "../validators/budget.validators";
import { validate } from "../middlewares/validator.middleware";
import { BudgetController } from "../controllers/budget.controller";

const router = Router();
const controller = new BudgetController();

router.get("/", controller.getAll);
router.post("/", budgetValidators.create, validate, controller.create);
router.put("/:id", budgetValidators.update, validate, controller.update);
router.get("/:id", budgetValidators.getById, validate, controller.getById);
router.delete("/:id", budgetValidators.delete, validate, controller.delete);

export { router as budgetRouter };
