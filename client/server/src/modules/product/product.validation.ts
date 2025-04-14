import { body } from "express-validator";

export const productValidators = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("brand")
    .notEmpty()
    .withMessage("Brand is required")
    .isString()
    .withMessage("Brand must be a string"),
  body("stock")
    .notEmpty()
    .withMessage("stock is required")
    .isNumeric()
    .withMessage("stock must be a number"),
  body("cost")
    .notEmpty()
    .withMessage("cost is required")
    .isNumeric()
    .withMessage("cost must be a number"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
];

export const increaseOrDecreaseStockValidators = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isString()
    .matches(/^(increase|decrease)$/),
];
