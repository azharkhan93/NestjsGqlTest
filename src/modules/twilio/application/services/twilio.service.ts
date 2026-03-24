import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { PhoneNumber } from '@common/domain/value-objects/phone-number.vo';

@Injectable()
export class TwilioService {
  private readonly client: Twilio;
  private readonly logger = new Logger(TwilioService.name);

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

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
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: formattedTo,
      });

      return { success: true, sid: response.sid, message: 'Sent' };
    } catch (error: any) {
      this.logger.error(`SMS error: ${error.message}`);
      return { success: false, message: error.message, errorCode: error.code };
    }
  }
}
