import { body, param } from "express-validator";

export const categoryValidators = {
  create: [
    body("categoryname")
      .notEmpty()
      .withMessage("Category name is required")
      .isLength({ min: 1, max: 50 })
      .withMessage("Category name must be between 1-50 characters")
      .trim(),

    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .trim(),
  ],

  update: [
    param("id").isUUID().withMessage("Invalid Category ID"),

    body("categoryname")
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage("Category name must be between 1-50 characters")
      .trim(),

    body("description").optional().trim(),
  ],

  getById: [param("id").isUUID().withMessage("Invalid category ID")],

  delete: [param("id").isUUID().withMessage("Invalid category ID")],
};
