import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  payCustomerUnpaidInvoice,
  updateCustomer,
} from "./customer.controller.js";
import {
  customerValidators,
  payInvoiceValidators,
} from "./customer.validation.js";

const router = express.Router();

// Get all customers
router.get("/", isAuthenticated, getAllCustomers);

router.post(
  "/",
  isAuthenticated,
  customerValidators,
  validationErrorHandler,
  createCustomer
);

// Pay customer unpaid invoice
router.put(
  "/pay-invoice/:invoiceId",
  isAuthenticated,
  isAdmin,
  payInvoiceValidators,
  validationErrorHandler,
  payCustomerUnpaidInvoice
);

// Update a customer
router.put(
  "/:customerId",
  isAuthenticated,
  isAdmin,
  customerValidators,
  validationErrorHandler,
  updateCustomer
);

// Delete a customer
router.delete("/:customerId", isAuthenticated, isAdmin, deleteCustomer);

export { router as customerRoute };
