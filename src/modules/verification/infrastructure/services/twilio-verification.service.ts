import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { IVerificationService } from '../../domain/services/verification-service.interface';
import { PhoneNumber } from '../../domain/value-objects/phone-number.vo';

@Injectable()
export class TwilioVerificationService implements IVerificationService {
  private readonly client: Twilio;
  private readonly logger = new Logger(TwilioVerificationService.name);
  private readonly serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID as string,
      process.env.TWILIO_AUTH_TOKEN as string,
    );
  }

  async start(phoneNumber: PhoneNumber) {
    try {
      if (!this.serviceSid) throw new Error('Verify Service SID missing');
      
      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verifications.create({ to: phoneNumber.getValue, channel: 'sms' });

      return { success: true, sid: verification.sid, message: 'OTP sent' };
    } catch (error: any) {
      this.logger.error(`Twilio error: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  async check(phoneNumber: PhoneNumber, code: string) {
    try {
      if (!this.serviceSid) throw new Error('Verify Service SID missing');

      const check = await this.client.verify.v2
        .services(this.serviceSid)
        .verificationChecks.create({ to: phoneNumber.getValue, code });

      return {
        success: check.status === 'approved',
        message: check.status === 'approved' ? 'Verified' : `Status: ${check.status}`,
      };
    } catch (error: any) {
      this.logger.error(`Twilio check error: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}
