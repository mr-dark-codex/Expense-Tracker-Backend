import { body, param } from "express-validator";

export const transactionsValidators = {
  create: [
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Amount must be positive"),

    body("modeid")
      .notEmpty()
      .withMessage("Mode ID is required")
      .isUUID()
      .withMessage("Invalid mode ID"),

    body("categoryid").optional().isUUID().withMessage("Invalid category ID"),

    body("transactiontype")
      .notEmpty()
      .withMessage("Transaction type is required")
      .isIn(["CREDIT", "DEBIT"])
      .withMessage("Transaction type must be CREDIT or DEBIT"),

    body("description").optional().trim(),

    body("transactiondate")
      .optional()
      .isISO8601()
      .withMessage("Invalid transaction date"),
    body("otherspayment")
      .optional()
      .isBoolean()
      .withMessage("Invalid others payment value"),
  ],

  update: [
    param("id").isUUID().withMessage("Invalid transaction ID"),

    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Amount must be positive"),

    body("modeid").optional().isUUID().withMessage("Invalid mode ID"),

    body("categoryid").optional().isUUID().withMessage("Invalid category ID"),

    body("transactiontype")
      .optional()
      .isIn(["CREDIT", "DEBIT"])
      .withMessage("Transaction type must be CREDIT or DEBIT"),

    body("description").optional().trim(),

    body("transactiondate")
      .optional()
      .isISO8601()
      .withMessage("Invalid transaction date"),
  ],

  getById: [param("id").isUUID().withMessage("Invalid transaction ID")],

  delete: [param("id").isUUID().withMessage("Invalid transaction ID")],
};
