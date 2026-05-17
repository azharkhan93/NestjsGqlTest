/**
 * Port interface for SMS sending — decouples domain from any specific SMS provider.
 */
export abstract class ISmsGateway {
  abstract sendSms(
    to: string,
    message: string,
  ): Promise<{
    success: boolean;
    sid?: string;
    message: string;
    errorCode?: number;
  }>;
}
