import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import {
  increaseOrDecreaseStockValidators,
  productValidators,
} from "./product.validation.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  incrementOrDecrementStock,
  updateProduct,
} from "./product.controller.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// Get all products
router.get("/", isAuthenticated, getAllProducts);

// Create a new product
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  productValidators,
  validationErrorHandler,
  createProduct
);

// Update a product
router.put(
  "/:productId",
  isAuthenticated,
  isAdmin,
  productValidators,
  validationErrorHandler,
  updateProduct
);

// Increase/Decrease stock of a product
router.put(
  "/:productId/stock",
  isAuthenticated,
  isAdmin,
  increaseOrDecreaseStockValidators,
  validationErrorHandler,
  incrementOrDecrementStock
);

// Delete a product
router.delete("/:productId", isAuthenticated, isAdmin, deleteProduct);

export { router as productRoute };
