import fs from "fs";
import { exec } from "child_process";
import path from "path";
import DBBackup, { DBBackupId } from "../modules/db-backup/db-backup.model.js";
import { extractDatabaseName } from "../utils/extractDatabaseName.js";

const backupOptions = {
  removeOldBackup: true,
  keepLastDaysBackup: 2,
};

const DB_CONNECTION_STRING = process.env.DATABASE_URL!;
const DB_NAME = extractDatabaseName(DB_CONNECTION_STRING);

async function getBackupPath() {
  const config = await DBBackup.findById(DBBackupId);

  if (!config?.path) return "";

  return path.join(config.path, "database-backup");
}

/**
 * Performs a backup of the MongoDB database.
 *
 * This function creates a backup of the specified MongoDB database using the mongodump utility.
 * It can optionally remove old backups based on the configuration settings.
 *
 * @async
 * @function backupDB
 * @returns {Promise<string>} A promise that resolves with a success message when the backup is complete.
 * @throws {Error} If the backup path is not found or if the backup process fails.
 *
 * @example
 * try {
 *   const result = await backupDB();
 *   console.log(result); // "Database backup completed successfully"
 * } catch (error) {
 *   console.error("Backup failed:", error);
 * }
 *
 * @requires fs
 * @requires child_process
 *
 * @description
 * The function performs the following steps:
 * 1. Retrieves the backup directory path.
 * 2. Checks if auto-backup is enabled in the configuration.
 * 3. Generates a new backup directory name based on the current date.
 * 4. If configured, removes old backups beyond a certain age.
 * 5. Executes the mongodump command to create the backup.
 *
 * Configuration is expected to be available in the `dbOptions` object, which should include:
 * - autoBackup: boolean
 * - removeOldBackup: boolean
 * - keepLastDaysBackup: number
 * - user: string
 * - pass: string
 * - host: string
 * - database: string
 */
export const backupDB = () => {
  return new Promise(async (resolve, reject) => {
    const backupDirPath = await getBackupPath();
    if (!backupDirPath) {
      reject(new Error("Backup path not found"));
      return;
    }

    let date = new Date();
    let currentDate = new Date(date.toString());
    let newBackupDir = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
    let newBackupPath = `${backupDirPath}-mongodump/${newBackupDir}`;

    if (backupOptions.removeOldBackup) {
      let beforeDate = new Date(currentDate.getTime());
      beforeDate.setDate(
        beforeDate.getDate() - backupOptions.keepLastDaysBackup
      );
      let oldBackupDir = `${beforeDate.getFullYear()}-${
        beforeDate.getMonth() + 1
      }-${beforeDate.getDate()}`;
      let oldBackupPath = `${backupDirPath}mongodump/${oldBackupDir}`;

      if (fs.existsSync(oldBackupPath)) {
        await fs.promises.rm(oldBackupPath, { recursive: true, force: true });
      }
    }

    const cmd = `mongodump --uri ${DB_CONNECTION_STRING} --out ${newBackupPath}`;

    console.log("Starting database backup");

    exec(cmd, (error) => {
      if (error) {
        console.error("Database backup failed", error);
        reject(error);
      } else {
        console.log("Database backup completed");
        resolve("Database backup completed successfully");
      }
    });
  });
};

/**
 * Restores a MongoDB database from a specified backup.
 *
 * This function restores a MongoDB database using the mongorestore utility
 * from a backup located in a specified folder.
 *
 * @async
 * @function dbRestore
 * @param {string} backupFolderName - The name of the folder containing the backup to restore.
 *                                    This should be in the format 'YYYY-MM-DD'.
 * @returns {Promise<void>}
 * @throws {Error} If the backup path is not found or if the restore process fails.
 *
 * @example
 * try {
 *   await dbRestore('2024-09-09');
 *   console.log('Database restored successfully');
 * } catch (error) {
 *   console.error('Restore failed:', error);
 * }
 *
 * @requires fs
 * @requires child_process
 *
 * @description
 * The function performs the following steps:
 * 1. Retrieves the backup directory path.
 * 2. Constructs the full path to the specified backup folder.
 * 3. Checks if the backup folder exists.
 * 4. If the folder exists, it executes the mongorestore command to restore the database.
 * 5. The restore process uses the --drop option to replace the existing database.
 *
 * Configuration is expected to be available in the `dbOptions` object, which should include:
 * - user: string
 * - pass: string
 * - host: string
 * - database: string
 *
 * @throws {Error} If the specified backup folder does not exist.
 * @throws {Error} If there's an error during the restore process.
 */
export const restoreDB = async (backupFolderName: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const backupDirPath = await getBackupPath();
    if (!backupDirPath) {
      reject(new Error("Backup path not found"));
      return;
    }

    const restorePath = `${backupDirPath}-mongodump/${backupFolderName}/${DB_NAME}`;

    if (fs.existsSync(restorePath)) {
      const cmd = `mongorestore --uri "${DB_CONNECTION_STRING}" --verbose --drop --dir ${restorePath}`;

      console.log("Starting database restore from backup folder");

      exec(cmd, (error) => {
        if (!error) {
          console.log(`Database restored from ${restorePath}`);
          resolve();
        } else {
          console.error(`Error restoring the database: ${error.message}`);
          reject(error);
        }
      });
    } else {
      const error = new Error(
        `Backup directory ${restorePath} does not exist.`
      );
      console.error(error.message);
      reject(error);
    }
  });
};
