import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RateLimiterService } from 'src/modules/user/services/rate-limiter.service';
import { ResetPasswordTokensService } from 'src/modules/user/services/reset-password-tokens.service';

@Injectable()
export class CronService {
  constructor(
    private readonly rateLimiterService: RateLimiterService,
    private readonly resetPasswordTokensService: ResetPasswordTokensService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  handleCron() {
    this.rateLimiterService.clearExpiredIpRecords();
    console.log('Expired IP records cleared');
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleCron2() {
    this.resetPasswordTokensService.clearExpiredTokens();
    console.log('Expired reset password tokens cleared');
  }
}
