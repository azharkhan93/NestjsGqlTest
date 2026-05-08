import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from '@modules/verification/application/services';
import { SmsResponseType, VerifyOtpResponseType } from '../types';

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation(() => SmsResponseType, { name: 'requestOtp' })
  async requestOtp(@Args('phoneNumber') phoneNumber: string) {
    return this.verificationService.requestOtp(phoneNumber);
  }

  @Mutation(() => VerifyOtpResponseType, { name: 'verifyOtp' })
  async verifyOtp(
    @Args('phoneNumber') phoneNumber: string,
    @Args('code') code: string,
  ) {
    return this.verificationService.verifyOtp(phoneNumber, code);
  }
}
