import express from "express";
import { getChartReports, getReports } from "./report.controller.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

// Get reports by year for the chart
router.get("/", isAuthenticated, isAdmin, getChartReports);

// Get reports paginated
router.get("/all", isAuthenticated, isAdmin, getReports);

export { router as reportsRoute };
