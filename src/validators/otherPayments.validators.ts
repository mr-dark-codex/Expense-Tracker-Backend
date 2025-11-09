import { body, param } from "express-validator";

export const otherPaymentsValidators = {
  create: [
    body("categoryid").optional().isUUID().withMessage("Invalid category ID"),

    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Amount must be positive"),

    body("paidamount")
      .optional()
      .isNumeric()
      .withMessage("Paid amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Paid amount must be positive"),

    body("description").optional().trim(),
  ],

  update: [
    param("id").isUUID().withMessage("Invalid other payment ID"),

    body("categoryid").optional().isUUID().withMessage("Invalid category ID"),

    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Amount must be positive"),

    body("paidamount")
      .optional()
      .isNumeric()
      .withMessage("Paid amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Paid amount must be positive"),

    body("description").optional().trim(),
  ],

  getById: [param("id").isUUID().withMessage("Invalid other payment ID")],

  delete: [param("id").isUUID().withMessage("Invalid other payment ID")],
};
