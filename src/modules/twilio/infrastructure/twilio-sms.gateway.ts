import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { PhoneNumber } from '@common/domain/value-objects/phone-number.vo';
import { ISmsGateway } from '@modules/twilio/domain/ports';

export interface SendSmsResult {
  success: boolean;
  message: string;
  sid?: string;
  errorCode?: number;
}

@Injectable()
export class TwilioSmsGateway implements ISmsGateway {
  private readonly client: Twilio;
  private readonly logger = new Logger(TwilioSmsGateway.name);

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      this.logger.error(
        'Twilio credentials not found in environment variables',
      );
    }

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(to: string, message: string): Promise<SendSmsResult> {
    try {
      const formattedTo = PhoneNumber.create(to).getValue;
      const response = await this.client.messages.create({
        body: message,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: formattedTo,
      });

      return { success: true, sid: response.sid, message: 'Sent' };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      const rawCode =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code?: unknown }).code
          : undefined;
      const errorCode =
        typeof rawCode === 'number'
          ? rawCode
          : typeof rawCode === 'string'
            ? parseInt(rawCode, 10) || undefined
            : undefined;

      this.logger.error(`SMS error: ${errMessage}`);
      return { success: false, message: errMessage, errorCode };
    }
  }
}
