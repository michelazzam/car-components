import express from "express";
import { validationErrorHandler } from "../../middlewares/errors.middleware.js";
import { isAuthenticated } from "../../middlewares/is-authenticated.middleware.js";
import { isSuperAmsAdmin } from "../../middlewares/is-super-ams-admin.middleware.js";
import { dbBackupValidator } from "./db-backup.validation.js";
import {
  getDbBackupPath,
  triggerDbBackup,
  updateDbBackupPath,
} from "./db-backup.controller.js";
import { isAdmin } from "../../middlewares/is-admin.middleware.js";

const router = express.Router();

router.post("/backup", isAuthenticated, isAdmin, triggerDbBackup);

router.get("/path", isAuthenticated, isSuperAmsAdmin, getDbBackupPath);

router.put(
  "/path",
  isAuthenticated,
  isSuperAmsAdmin,
  dbBackupValidator,
  validationErrorHandler,
  updateDbBackupPath
);

export { router as dbBackupRoute };
