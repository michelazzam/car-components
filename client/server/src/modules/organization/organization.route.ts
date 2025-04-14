import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import { organizationValidators } from "./organization.validation.js";
import {
  getOrganizationInfo,
  updateOrganizationInfo,
} from "./organization.controller.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// Get organization info
router.get("/", isAuthenticated, getOrganizationInfo);

// Update organization info
router.put(
  "/",
  isAuthenticated,
  isAdmin,
  organizationValidators,
  validationErrorHandler,
  updateOrganizationInfo
);

export { router as organizationRoute };
