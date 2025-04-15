import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RateLimiterService } from 'src/modules/user/services/rate-limiter.service';

@Injectable()
export class CronService {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  handleCron() {
    this.rateLimiterService.clearExpiredIpRecords();
    console.log('Expired IP records cleared');
  }
}
