import express from "express";
import { getUsdRate, updateUsdRate } from "./accounting.controller.js";
import { usdRateValidator } from "./accounting.validation.js";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

router.get("/usdRate", isAuthenticated, getUsdRate);

router.put(
  "/usdRate",
  isAuthenticated,
  isAdmin,
  usdRateValidator,
  validationErrorHandler,
  updateUsdRate
);

export { router as accountingRoute };
