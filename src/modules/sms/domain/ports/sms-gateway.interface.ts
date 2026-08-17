/**
 * Port interface for SMS sending — decouples domain from any specific SMS provider.
 */
export interface SendSmsResult {
  success: boolean;
  message: string;
  sid?: string;
  errorCode?: number;
}

export abstract class ISmsGateway {
  abstract sendSms(to: string, message: string): Promise<SendSmsResult>;
}
