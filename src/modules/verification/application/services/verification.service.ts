import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PhoneNumber } from '@common/domain/value-objects/phone-number.vo';
import { ISmsGateway } from '@modules/twilio/domain/ports';
import { IVerificationRepository } from '@modules/verification/domain/repositories/verification.repository.interface';

const OTP_EXPIRY_MS = 2 * 60 * 1000;

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly repository: IVerificationRepository,
    private readonly smsGateway: ISmsGateway,
  ) {}

  async requestOtp(rawPhone: string) {
    const phoneNumber = PhoneNumber.create(rawPhone);
    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await this.repository.save({
      phoneNumber: phoneNumber.getValue,
      code,
      expiresAt,
    });

    this.logger.log(
      `OTP saved for ${phoneNumber.getValue}, expires at ${expiresAt.toISOString()}`,
    );

    return this.smsGateway.sendSms(
      phoneNumber.getValue,
      `Your verification code is: ${code}. Valid for 2 minutes.`,
    );
  }

  async verifyOtp(rawPhone: string, code: string) {
    const phoneNumber = PhoneNumber.create(rawPhone);
    const verification = await this.repository.findByPhoneAndCode(
      phoneNumber.getValue,
      code,
    );

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.repository.markAsUsed(verification.id);

    return { success: true, message: 'Verification successful' };
  }
}
