import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expense.controller.js";
import { expenseValidators } from "./expense.validation.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// Get all expenses
router.get("/", isAuthenticated, isAdmin, getAllExpenses);

// Create a new expense
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  expenseValidators,
  validationErrorHandler,
  createExpense
);

// Update a expense
router.put(
  "/:expenseId",
  isAuthenticated,
  isAdmin,
  expenseValidators,
  validationErrorHandler,
  updateExpense
);

// Delete a expense
router.delete("/:expenseId", isAuthenticated, isAdmin, deleteExpense);

export { router as expenseRoute };
