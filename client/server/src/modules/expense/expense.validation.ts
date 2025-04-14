import { body } from "express-validator";

export const expenseValidators = [
  body("expenseTypeId")
    .isMongoId()
    .withMessage("Expense type ID must be a valid MongoDB ObjectId"),
  body("amount")
    .notEmpty()
    .withMessage("amount is required")
    .isNumeric()
    .withMessage("amount must be a number"),
  body("date")
    .notEmpty()
    .withMessage("date is required")
    .isString()
    .withMessage("date must be a string"),
];
