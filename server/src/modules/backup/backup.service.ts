import { Injectable } from '@nestjs/common';
import mongoose, { Connection, Model } from 'mongoose';
import { EnvConfigService } from 'src/config/env.validation';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Backup, IBackup } from './backup.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateLocalBackupPathDto } from './dto/update-local-backup-path.dto';
import { execFile } from 'child_process';
import * as fs from 'fs';

@Injectable()
export class BackupService {
  // Here we are using the global connection we use in our server as the main connection
  // and creating a new isolated connection for the backups
  constructor(
    @InjectConnection() private readonly mainConnection: Connection, // global
    private readonly configService: EnvConfigService,
    @InjectModel(Backup.name)
    private backupModel: Model<IBackup>,
  ) {}

  private async getLastCloudBackupDate() {
    try {
      const lastBackup = await this.backupModel.findOne().lean();

      if (!lastBackup) {
        const lb = await this.backupModel.create({
          lastCloudBackup: new Date(),
        });
        return lb.lastCloudBackup;
      }

      return lastBackup?.lastCloudBackup;
    } catch (error) {
      console.log(error);
    }
  }

  private async setLastCloudBackupDate(date: Date) {
    await this.backupModel.findOneAndUpdate(
      {},
      { $set: { lastCloudBackup: date } },
      { upsert: true },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async runIncrementalCloudBackup() {
    const lastCloudBackup = await this.getLastCloudBackupDate();
    const now = new Date();

    // Create backup DB connection
    const backupConnection = await mongoose
      .createConnection(this.configService.get('BACKUP_DATABASE_URL')!)
      .asPromise();

    try {
      const modelNames = this.mainConnection.modelNames();

      for (const name of modelNames) {
        const localModel = this.mainConnection.model(name);
        const cloudModel = backupConnection.model(name, localModel.schema);

        const updatedDocs = await localModel
          .find({
            updatedAt: { $gt: lastCloudBackup },
          })
          .lean();

        for (const doc of updatedDocs) {
          await cloudModel.updateOne(
            { _id: doc._id },
            { $set: doc },
            { upsert: true },
          );
        }
      }

      await this.setLastCloudBackupDate(now);
      console.log('Ran incremental backup');
    } catch (err) {
      console.error('Backup failed:', err);
    } finally {
      // Always close the connection after use
      await backupConnection.close();
    }
  }

  async getLocalBackupPath() {
    const backup = await this.backupModel.findOne().lean();
    return { path: backup?.localBackupPath || '' };
  }

  async updateLocalBackupPath(dto: UpdateLocalBackupPathDto) {
    await this.backupModel.findOneAndUpdate(
      {},
      { $set: { localBackupPath: dto.path } },
      { upsert: true },
    );
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
  triggerLocalBackup = (): Promise<string> => {
    const backupOptions = {
      removeOldBackup: true,
      keepLastDaysBackup: 2,
    };

    return new Promise(async (resolve, reject) => {
      const { path: backupDirPath } = await this.getLocalBackupPath();
      if (!backupDirPath) {
        reject(new Error('Backup path not found'));
        return;
      }

      let date = new Date();
      let currentDate = new Date(date.toString());
      let newBackupDir = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}`;
      let newBackupPath = `${backupDirPath}mongodump/${newBackupDir}`;

      if (backupOptions.removeOldBackup) {
        let beforeDate = new Date(currentDate.getTime());
        beforeDate.setDate(
          beforeDate.getDate() - backupOptions.keepLastDaysBackup,
        );
        let oldBackupDir = `${beforeDate.getFullYear()}-${
          beforeDate.getMonth() + 1
        }-${beforeDate.getDate()}`;
        let oldBackupPath = `${backupDirPath}mongodump/${oldBackupDir}`;

        if (fs.existsSync(oldBackupPath)) {
          await fs.promises.rm(oldBackupPath, { recursive: true, force: true });
        }
      }

      const mongodumpPath = 'mongodump'; // or full path to mongodump if needed
      const args = [
        '--uri',
        this.configService.get('DATABASE_URL')!,
        '--out',
        newBackupPath,
      ];

      execFile(mongodumpPath, args, (error) => {
        if (error) {
          console.error('Database backup failed', error);
          reject(error);
        } else {
          console.log('Database backup completed');
          resolve('Database backup completed successfully');
        }
      });
    });
  };
}
