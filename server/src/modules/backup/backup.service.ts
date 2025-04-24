import { Injectable } from '@nestjs/common';
import mongoose, { Connection, Model } from 'mongoose';
import { EnvConfigService } from 'src/config/env.validation';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Backup, IBackup } from './backup.schema';

@Injectable()
export class BackupService {
  private backupConnection: Connection;

  // Here we are using the global connection we use in our server as the main connection
  // and creating a new isolated connection for the backups
  constructor(
    @InjectConnection() private readonly mainConnection: Connection, // global
    private readonly configService: EnvConfigService,
    @InjectModel(Backup.name)
    private backupModel: Model<IBackup>,
  ) {
    this.backupConnection = mongoose.createConnection(
      this.configService.get('BACKUP_DATABASE_URL')!,
    );
  }

  private async getLastBackupDate() {
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

  private async setLastBackupDate(date: Date) {
    await this.backupModel.findOneAndUpdate(
      {},
      { $set: { lastBackup: date } },
      { upsert: true },
    );
  }

  async runIncrementalBackup() {
    const lastBackup = await this.getLastBackupDate();
    const now = new Date();

    const modelNames = this.mainConnection.modelNames();

    for (const name of modelNames) {
      const localModel = this.mainConnection.model(name);
      const cloudModel = this.backupConnection.model(name, localModel.schema);

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

    await this.setLastBackupDate(now);
  }
}
