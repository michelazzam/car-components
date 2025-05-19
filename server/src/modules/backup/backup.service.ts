import { Injectable } from '@nestjs/common';
import mongoose, { Connection, Model } from 'mongoose';
import { EnvConfigService } from 'src/config/env.validation';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Backup, IBackup } from './backup.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

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
        const lb = await this.backupModel.create({ lastBackup: new Date() });
        return lb.lastBackup;
      }

      return lastBackup?.lastBackup;
    } catch (error) {
      console.log(error);
    }
  }

  private async setLastCloudBackupDate(date: Date) {
    await this.backupModel.findOneAndUpdate(
      {},
      { $set: { lastBackup: date } },
      { upsert: true },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async runIncrementalCloudBackup() {
    const lastBackup = await this.getLastCloudBackupDate();
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
            updatedAt: { $gt: lastBackup },
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
}
