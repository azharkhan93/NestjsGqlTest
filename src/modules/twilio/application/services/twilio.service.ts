import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { PhoneNumber } from '@modules/verification/domain/value-objects/phone-number.vo';

@Injectable()
export class TwilioService {
  private readonly client: Twilio;
  private readonly logger = new Logger(TwilioService.name);

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      this.logger.error('Twilio credentials not found in environment variables');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(to: string, message: string) {
    try {
      const formattedTo = PhoneNumber.create(to).getValue;
      const response = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedTo,
      });

      return { success: true, sid: response.sid, message: 'Sent', errorCode: undefined };
    } catch (error: any) {
      this.logger.error(`SMS error: ${error.message}`);
      return { success: false, message: error.message, errorCode: error.code, sid: undefined };
    }
  }
}
