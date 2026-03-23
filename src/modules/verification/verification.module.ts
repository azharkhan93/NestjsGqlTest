import { Module } from '@nestjs/common';
import { VerificationService } from './application/services/verification.service';
import { VerificationResolver } from './presentation/graphql/resolvers/verification.resolver';
import { IVerificationService } from './domain/services/verification-service.interface';
import { TwilioVerificationService } from './infrastructure/services/twilio-verification.service';

@Module({
  providers: [
    VerificationService,
    VerificationResolver,
    {
      provide: IVerificationService,
      useClass: TwilioVerificationService,
    },
  ],
  exports: [VerificationService],
})
export class VerificationModule {}
