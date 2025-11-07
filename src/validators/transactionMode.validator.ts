import { body, param } from "express-validator";

export const transactionModeValidators = {
  create: [
    body("modename")
      .notEmpty()
      .withMessage("Mode name is required")
      .isLength({ min: 1, max: 50 })
      .withMessage("Mode name must be between 1-50 characters")
      .trim(),

    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage("Amount must be a valid decimal with up to 2 decimal places")
      .custom((value) => {
        if (value < 0) throw new Error("Amount cannot be negative");
        return true;
      }),

    body("currency")
      .optional()
      .isLength({ max: 10 })
      .withMessage("Currency must be max 10 characters")
      .trim(),

    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .trim(),
  ],

  update: [
    param("id").isUUID().withMessage("Invalid transaction mode ID"),

    body("modename")
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage("Mode name must be between 1-50 characters")
      .trim(),

    body("amount")
      .optional()
      .isDecimal({ decimal_digits: "0,2" })
      .withMessage("Amount must be a valid decimal")
      .custom((value) => {
        if (value < 0) throw new Error("Amount cannot be negative");
        return true;
      }),

    body("currency")
      .optional()
      .isLength({ max: 10 })
      .withMessage("Currency must be max 10 characters")
      .trim(),

    body("description").optional().trim(),
  ],

  getById: [param("id").isUUID().withMessage("Invalid transaction mode ID")],

  delete: [param("id").isUUID().withMessage("Invalid transaction mode ID")],
};
