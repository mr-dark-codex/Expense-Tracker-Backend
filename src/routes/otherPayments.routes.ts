import { Router } from "express";
import { otherPaymentsValidators } from "../validators/otherPayments.validators";
import { validate } from "../middlewares/validator.middleware";
import { OtherPaymentsController } from "../controllers/otherPayments.controller";

const router = Router();
const controller = new OtherPaymentsController();

router.get("/", controller.getAll);
router.post("/", otherPaymentsValidators.create, validate, controller.createV2);
router.put("/:id", otherPaymentsValidators.update, validate, controller.update);
router.get(
  "/:id",
  otherPaymentsValidators.getById,
  validate,
  controller.getById,
);
router.delete(
  "/:id",
  otherPaymentsValidators.delete,
  validate,
  controller.delete,
);

export { router as otherPaymentsRouter };
