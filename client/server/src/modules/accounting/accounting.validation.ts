import { body } from "express-validator";

export const usdRateValidator = [
  body("usdRate")
    .isFloat({ min: 0 })
    .withMessage("Usd rate must be a positive number")
    .isNumeric()
    .withMessage("Usd rate must be a number")
    .notEmpty()
    .withMessage("Usd rate is required"),
];
