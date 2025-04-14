import { body } from "express-validator";

export const gasTypeValidators = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string"),
];
