import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { randomInt } from 'crypto';

import { PhoneNumber } from '../../domain/value-objects/phone-number.vo';
import { TwilioService } from '@modules/twilio/application/services/twilio.service';
import { IVerificationRepository } from '@modules/verification/domain/repositories/verification.repository.interface';

const OTP_EXPIRY_MS = 2 * 60 * 1000; 

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly repository: IVerificationRepository,
    private readonly twilioService: TwilioService,
  ) {}

  async requestOtp(rawPhone: string) {
    const phoneNumber = PhoneNumber.create(rawPhone);
    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await this.repository.save({ phoneNumber: phoneNumber.getValue, code, expiresAt });

    this.logger.log(`OTP saved for ${phoneNumber.getValue}, expires at ${expiresAt.toISOString()}`);

    return this.twilioService.sendSms(
      phoneNumber.getValue,
      `Your verification code is: ${code}. Valid for 2 minutes.`,
    );
  }

  async verifyOtp(rawPhone: string, code: string) {
    const phoneNumber = PhoneNumber.create(rawPhone);
    const verification = await this.repository.findOne(phoneNumber.getValue, code);

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.repository.markAsUsed(verification.id);

    return { success: true, message: 'Verification successful' };
  }
}
