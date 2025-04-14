import { body } from "express-validator";

export const expenseTypeValidators = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string"),
];
