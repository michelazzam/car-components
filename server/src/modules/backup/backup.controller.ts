import { Controller } from '@nestjs/common';
// import { BackupService } from './backup.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('DB Backup')
@Controller('backup')
export class BackupController {
  constructor() {}
}
