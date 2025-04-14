import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "./vehicle.controller.js";
import { vehicleValidators } from "./vehicle.validation.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllVehicles);

router.post(
  "/",
  isAuthenticated,
  vehicleValidators,
  validationErrorHandler,
  createVehicle
);

router.put(
  "/:vehicleId",
  isAuthenticated,
  isAdmin,
  vehicleValidators,
  validationErrorHandler,
  updateVehicle
);

router.delete("/:vehicleId", isAuthenticated, isAdmin, deleteVehicle);

export { router as vehicleRoute };
