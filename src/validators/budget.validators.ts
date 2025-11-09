import { body, param } from "express-validator";

export const budgetValidators = {
  create: [
    body("amount")
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Amount must be positive"),

    body("startdate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),

    body("enddate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
  ],

  update: [
    param("id").isUUID().withMessage("Invalid Budget ID"),

    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Amount must be positive"),

    body("startdate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),

    body("enddate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
  ],

  getById: [param("id").isUUID().withMessage("Invalid budget ID")],

  delete: [param("id").isUUID().withMessage("Invalid budget ID")],
};
