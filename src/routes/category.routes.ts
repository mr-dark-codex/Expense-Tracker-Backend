import { Router } from "express";
import { categoryValidators } from "../validators/category.validators";
import { validate } from "../middlewares/validator.middleware";
import { CategoryController } from "../controllers/category.controller";

const router = Router();
const controller = new CategoryController();
// router.get("/", controller.getAll);
router.post("/", categoryValidators.create, validate, controller.create);
// router.put('/:id', transactionModeValidators.update, validate, controller.update);
// router.get("/:id", controller.getById);
// router.delete("/:id", controller.delete);

export { router as categoryRouter };
