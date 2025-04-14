import { body } from "express-validator";
import { UserRole } from "./user.model.js";

const users: UserRole[] = ["employee", "admin"];

export const addUserValidationRules = [
  body("fullName")
    .isString()
    .withMessage("Full name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("username")
    .isString()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("role").isIn(users).withMessage("Invalid role"),
  body("phoneNumber")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 11 })
    .withMessage("Phone number must be at least 11 characters long"),
  body("address")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Address must be at least 5 characters long"),
];

export const loginUserValidationRules = [
  body("username")
    .isString()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isString()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

export const userChangePasswordValidationRules = [
  body("currentPassword")
    .isString()
    .withMessage("currentPassword is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("currentPassword must be at least 5 characters long"),
  body("newPassword")
    .isString()
    .withMessage("newPassword is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("newPassword must be at least 5 characters long"),
];

export const userEditProfileValidationRules = [
  body("fullName")
    .isString()
    .withMessage("Full name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("username")
    .isString()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("phoneNumber")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Phone number must be at least 8 characters long"),
  body("address")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Address must be at least 5 characters long"),
];

export const editUserValidationRules = [
  body("fullName")
    .isString()
    .withMessage("Full name is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("username")
    .isString()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("role").isIn(users).withMessage("Invalid role"),
  body("phoneNumber")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Phone number must be at least 8 characters long"),
  body("address")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Address must be at least 5 characters long"),
  body("password")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];
