import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISmsGateway, SendSmsResult } from '../domain/ports';

interface ApiTxtApiResponse {
  status: string;
  message: string;
  data?: { request_id?: string };
}

@Injectable()
export class ApiTxtSmsGateway implements ISmsGateway {
  private readonly logger = new Logger(ApiTxtSmsGateway.name);

  constructor(private readonly configService: ConfigService) {}

  async sendSms(to: string, message: string): Promise<SendSmsResult> {
    const authkey = this.configService.get<string>('APITXT_AUTH_KEY');
    const baseUrl =
      this.configService.get<string>('APITXT_BASE_URL') ??
      'https://apitxt.com/api/sendOTP';

    if (!authkey) {
      this.logger.error('APITXT_AUTH_KEY missing in environment variables');
      return { success: false, message: 'SMS provider configuration missing' };
    }

    const mobile = to.replace(/\D/g, '').replace(/^(\d{10})$/, '91$1');
    const otp = message.match(/\b\d{4,8}\b/)?.[0] ?? message;

    try {
      const query = new URLSearchParams({
        authkey,
        mobile,
        otp,
        channel: 'sms',
        country: '91',
      });
      const res = await fetch(`${baseUrl}?${query}`);
      const data = (await res.json().catch(() => ({}))) as ApiTxtApiResponse;

      if (res.ok && data.status === 'success') {
        this.logger.log(
          `ApiTxt OTP sent to ${mobile}. SID: ${data.data?.request_id}`,
        );
        return {
          success: true,
          sid: data.data?.request_id,
          message: data.message || 'OTP Sent Successfully',
        };
      }

      this.logger.warn(
        `ApiTxt OTP failure for ${mobile}: ${data.message || res.statusText}`,
      );
      return {
        success: false,
        message: data.message || 'Failed to send OTP',
        errorCode: res.status,
      };
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`ApiTxt SMS dispatch exception: ${errMessage}`);
      return { success: false, message: errMessage };
    }
  }
}
