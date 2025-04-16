import { body } from "express-validator";

export const vehicleValidators = [
  body("customerId")
    .notEmpty()
    .isMongoId()
    .withMessage("Customer ID must be a valid ObjectId"),
  body("model").notEmpty().isString().withMessage("Model is required"),
  body("gasTypeId")
    .notEmpty()
    .isMongoId()
    .withMessage("gasTypeId must be a valid ObjectId"),
  body("vehicleNb")
    .notEmpty()
    .isString()
    .withMessage("Vehicle number is required"),
];
