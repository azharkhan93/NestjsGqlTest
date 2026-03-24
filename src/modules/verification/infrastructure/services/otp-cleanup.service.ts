import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IVerificationRepository } from '../../domain/repositories/verification.repository.interface';

@Injectable()
export class OtpCleanupService {
  private readonly logger = new Logger(OtpCleanupService.name);

  constructor(private readonly repository: IVerificationRepository) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Running OTP cleanup cron job');
    await this.repository.deleteExpired();
  }
}
