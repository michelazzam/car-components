import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import {
  getAllGasTypes,
  createGasType,
  updateGasType,
  deleteGasType,
} from "./gasType.controller.js";
import { gasTypeValidators } from "./gasType.validation.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// Get all gas types
router.get("/", isAuthenticated, isAdmin, getAllGasTypes);

// Create a new gasType
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  gasTypeValidators,
  validationErrorHandler,
  createGasType
);

// Update a gasType
router.put(
  "/:gasTypeId",
  isAuthenticated,
  isAdmin,
  gasTypeValidators,
  validationErrorHandler,
  updateGasType
);

// Delete a gasType
router.delete("/:gasTypeId", isAuthenticated, isAdmin, deleteGasType);

export { router as gasTypeRoute };
