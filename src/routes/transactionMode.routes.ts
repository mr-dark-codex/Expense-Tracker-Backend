import { Router } from "express";
import { transactionModeValidators } from "../validators/transactionMode.validator";
import { validate } from "../middlewares/validator.middleware";
import { TransactionModeController } from "../controllers/transactionMode.controller";

const router = Router();
const controller = new TransactionModeController();
router.get("/", controller.getAll);
router.post("/", transactionModeValidators.create, validate, controller.create);
router.put('/:id', transactionModeValidators.update, validate, controller.update);
router.get("/:id", controller.getById);
router.delete("/:id", controller.delete);

export { router as transactionModeRouter };
