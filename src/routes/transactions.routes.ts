import { Router } from "express";
import { transactionsValidators } from "../validators/transactions.validators";
import { validate } from "../middlewares/validator.middleware";
import { TransactionsController } from "../controllers/transactions.controller";

const router = Router();
const controller = new TransactionsController();

router.get("/", controller.getAll);
// router.post("/", transactionsValidators.create, validate, controller.create);
router.post("/", controller.create);
router.put("/:id", transactionsValidators.update, validate, controller.update);
router.get(
  "/:id",
  transactionsValidators.getById,
  validate,
  controller.getById,
);
router.delete(
  "/:id",
  transactionsValidators.delete,
  validate,
  controller.delete,
);

router.post("/get-expense", controller.getMonthlySpentByCategory);
export { router as transactionsRouter };
