import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { EnvConfigService } from 'src/config/env.validation';
import { Backup, BackupSchema } from './backup.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Backup.name, schema: BackupSchema }]),
  ],
  controllers: [BackupController],
  providers: [BackupService, EnvConfigService],
})
export class BackupModule {}
