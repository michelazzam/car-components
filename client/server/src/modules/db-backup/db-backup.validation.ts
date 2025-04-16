import { body } from "express-validator";

export const dbBackupValidator = [
  body("path")
    .isString()
    .withMessage("Path should be a string")
    .notEmpty()
    .withMessage("Path is required"),
];
