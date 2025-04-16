import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import { serviceValidators } from "./service.validation.js";
import { createService, getAllServices } from "./service.controller.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllServices);

router.post(
  "/",
  isAuthenticated,
  isAdmin,
  serviceValidators,
  validationErrorHandler,
  createService
);

export { router as serviceRoute };
