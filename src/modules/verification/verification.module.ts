import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { VerificationService } from './application/services/verification.service';
import { VerificationResolver } from './presentation/graphql/resolvers/verification.resolver';
import { SmsModule } from '@modules/sms/sms.module';
import { PrismaModule } from '@common/infrastructure/persistence/prisma/prisma.module';
import { IVerificationRepository } from './domain/repositories/verification.repository.interface';
import { PrismaVerificationRepository } from './infrastructure/persistence/prisma/prisma-verification.repository';
import { OtpCleanupService } from './infrastructure/services/otp-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot(), SmsModule, PrismaModule],
  providers: [
    VerificationService,
    VerificationResolver,
    OtpCleanupService,
    {
      provide: IVerificationRepository,
      useClass: PrismaVerificationRepository,
    },
  ],
  exports: [VerificationService],
})
export class VerificationModule {}
