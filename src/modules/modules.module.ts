import { Module } from '@nestjs/common';

import { RolesModule } from './roles/roles.module';
import { TwilioModule } from './twilio/twilio.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [RolesModule, TwilioModule, VerificationModule],
})
export class ModulesModule {}
