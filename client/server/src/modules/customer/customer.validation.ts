import { body } from "express-validator";

export const customerValidators = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name must be a string"),
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isString()
    .withMessage("phone must be a string")
    .isLength({ min: 11 })
    .withMessage("Phone number must be at least 11 characters long"),
];

export const payInvoiceValidators = [
  body("amountPaidUsd")
    .isNumeric()
    .withMessage("amountPaidUsd is required & numeric"),
  body("amountPaidLbp")
    .isNumeric()
    .withMessage("amountPaidLbp is required & numeric"),
];
