import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { BackupService } from './backup.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateLocalBackupPathDto } from './dto/update-local-backup-path.dto';

@ApiTags('DB Backup')
@Controller({ version: '1', path: 'backup' })
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('path')
  async getLocalBackupPath() {
    return await this.backupService.getLocalBackupPath();
  }

  @Put('path')
  async updateLocalBackupPath(@Body() dto: UpdateLocalBackupPathDto) {
    await this.backupService.updateLocalBackupPath(dto);
    return { message: 'Path updated successfully' };
  }

  @Post('trigger-backup')
  async backupDB() {
    await this.backupService.backupDB();
    return { message: 'Database backed up successfully' };
  }
}
