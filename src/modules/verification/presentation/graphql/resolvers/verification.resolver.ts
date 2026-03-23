import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from '../../../application/services/verification.service';
import { SmsResponseType } from '@modules/twilio/presentation/graphql/types/sms-response.type';

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => SmsResponseType, { name: 'requestOtp' })
  async requestOtp(@Args('phoneNumber') phoneNumber: string) {
    return this.verificationService.requestOtp(phoneNumber);
  }

  @Mutation(() => SmsResponseType, { name: 'verifyOtp' })
  async verifyOtp(
    @Args('phoneNumber') phoneNumber: string,
    @Args('code') code: string,
  ) {
    return this.verificationService.verifyOtp(phoneNumber, code);
  }
}
