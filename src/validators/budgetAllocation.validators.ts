import { body, param } from "express-validator";

export const budgetAllocationValidators = {
  create: [
    body("budgetid")
      .notEmpty()
      .withMessage("Budget ID is required")
      .isUUID()
      .withMessage("Budget ID must be a valid UUID"),

    body("categoryid")
      .notEmpty()
      .withMessage("Category ID is required")
      .isUUID()
      .withMessage("Category ID must be a valid UUID"),

    body("allocatedamount")
      .notEmpty()
      .isNumeric()
      .withMessage("Allocated amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Allocated amount must be positive"),

    body("description").optional().trim(),
  ],

  update: [
    param("id").isUUID().withMessage("Invalid Budget Allocation ID"),

    body("budgetid")
      .optional()
      .isUUID()
      .withMessage("Budget ID must be a valid UUID"),

    body("categoryid")
      .optional()
      .isUUID()
      .withMessage("Category ID must be a valid UUID"),

    body("allocatedamount")
      .optional()
      .isNumeric()
      .withMessage("Allocated amount must be a number")
      .isFloat({ min: 0 })
      .withMessage("Allocated amount must be positive"),

    body("description").optional().trim(),
  ],

  getById: [param("id").isUUID().withMessage("Invalid budget allocation ID")],

  delete: [param("id").isUUID().withMessage("Invalid budget allocation ID")],
};
