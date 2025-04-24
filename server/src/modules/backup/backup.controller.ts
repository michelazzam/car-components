import { Controller } from '@nestjs/common';
import { BackupService } from './backup.service';
import { IsPublic } from '../user/decorators/isPublic.decorator';
import { ApiTags } from '@nestjs/swagger';
// import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('DB Backup')
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  // uncomment for testing purposes:

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @IsPublic()
  // @Get('trigger-backup')
  async backupNow() {
    await this.backupService.runIncrementalBackup();
    return { success: true };
  }
}
