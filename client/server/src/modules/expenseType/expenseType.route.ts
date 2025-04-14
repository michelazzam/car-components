import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import {
  getAllExpenseTypes,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
} from "./expenseType.controller.js";
import { expenseTypeValidators } from "./expenseType.validation.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// Get all expenseTypes
router.get("/", isAuthenticated, isAdmin, getAllExpenseTypes);

// Create a new expenseType
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  expenseTypeValidators,
  validationErrorHandler,
  createExpenseType
);

// Update a expenseType
router.put(
  "/:expenseTypeId",
  isAuthenticated,
  isAdmin,
  expenseTypeValidators,
  validationErrorHandler,
  updateExpenseType
);

// Delete a expenseType
router.delete("/:expenseTypeId", isAuthenticated, isAdmin, deleteExpenseType);

export { router as expenseTypeRoute };
