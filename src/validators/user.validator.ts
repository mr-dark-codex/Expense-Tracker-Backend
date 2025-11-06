import { body } from "express-validator";

export const userValidations = {
  register: [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .trim(),
  ],
  login: [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password").not().isEmpty().withMessage("Password is required").trim(),
  ],
};
