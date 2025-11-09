import { Router } from "express";
import { categoryValidators } from "../validators/category.validators";
import { validate } from "../middlewares/validator.middleware";
import { CategoryController } from "../controllers/category.controller";

const router = Router();
const controller = new CategoryController();

router.get("/", controller.getAll);
router.post("/", categoryValidators.create, validate, controller.create);
router.put("/:id", categoryValidators.update, validate, controller.update);
router.get("/:id", categoryValidators.getById, validate, controller.getById);
router.delete("/:id", categoryValidators.delete, validate, controller.delete);

export { router as categoryRouter };
