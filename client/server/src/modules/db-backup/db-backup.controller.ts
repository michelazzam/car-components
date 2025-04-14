import { Request, Response } from "express";
import DBBackup, { DBBackupId } from "./db-backup.model.js";
import { backupDB } from "../../config/db-backup.js";

/**
 * @api {get} /db-backup/path Get path (superAmsAdmin only)
 */
export const getDbBackupPath = async (_: Request, res: Response) => {
  try {
    const config = await DBBackup.findById(DBBackupId);

    res.json({ path: config?.path });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Getting the Path failed",
    });
  }
};

/**
 * @api {put} /db-backup/path Update path (superAmsAdmin only)
 */
export const updateDbBackupPath = async (req: Request, res: Response) => {
  try {
    const { path } = req.body;

    await DBBackup.findByIdAndUpdate(
      DBBackupId,
      {
        $set: { path },
      },
      { upsert: true }
    );

    res.json({ message: "Path updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Updating the Path failed",
    });
  }
};

/**
 * @api {post} /db-backup Trigger a DB backup (admin)
 *
 */
export const triggerDbBackup = async (_: Request, res: Response) => {
  try {
    await backupDB();

    res.json({ message: "Database backed up successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Triggering the DB backup failed",
    });
  }
};
