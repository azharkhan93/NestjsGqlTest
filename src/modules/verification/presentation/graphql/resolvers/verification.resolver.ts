import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { VerificationService } from '@modules/verification/application/services';
import { SmsResponseType, VerifyOtpResponseType } from '../types';

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Throttle({ default: { ttl: 900000, limit: 3 } })
  @Mutation(() => SmsResponseType, { name: 'requestOtp' })
  async requestOtp(@Args('phoneNumber') phoneNumber: string) {
    return this.verificationService.requestOtp(phoneNumber);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Mutation(() => VerifyOtpResponseType, { name: 'verifyOtp' })
  async verifyOtp(
    @Args('phoneNumber') phoneNumber: string,
    @Args('code') code: string,
  ) {
    return this.verificationService.verifyOtp(phoneNumber, code);
  }
}
