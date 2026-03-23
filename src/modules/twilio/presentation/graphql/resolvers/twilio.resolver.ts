import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TwilioService } from '@modules/twilio/application/services/twilio.service';
import { SmsResponseType } from '../types/sms-response.type';

@Resolver()
export class TwilioResolver {
  constructor(private readonly twilioService: TwilioService) {}

  @Mutation(() => SmsResponseType)
  async sendSms(
    @Args('to') to: string,
    @Args('message') message: string,
  ): Promise<SmsResponseType> {
    const result = await this.twilioService.sendSms(to, message);
    return {
      success: result.success,
      sid: result.sid,
      message: result.message,
      errorCode: result.errorCode,
    };
  }
}
