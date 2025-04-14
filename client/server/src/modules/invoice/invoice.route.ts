import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import {
  createInvoice,
  deleteInvoice,
  editInvoice,
  getAllInvoices,
} from "./invoice.controller.js";
import { createEditInvoiceValidators } from "./invoice.validation.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// Get all invoices
router.get("/", isAuthenticated, isAdmin, getAllInvoices);

// Create a new order
router.post(
  "/",
  isAuthenticated,
  createEditInvoiceValidators,
  validationErrorHandler,
  createInvoice
);

// Edit an order
router.put(
  "/:invoiceId",
  isAuthenticated,
  isAdmin,
  createEditInvoiceValidators,
  validationErrorHandler,
  editInvoice
);

// Delete an order
router.delete("/:invoiceId", isAuthenticated, isAdmin, deleteInvoice);

export { router as invoiceRoute };
