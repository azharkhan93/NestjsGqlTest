import { Module } from '@nestjs/common';

import { RolesModule } from './roles/roles.module';
import { TwilioModule } from './twilio/twilio.module';
import { VerificationModule } from './verification/verification.module';
import { VendorsModule } from './vendors/vendors.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RolesModule, TwilioModule, VerificationModule, VendorsModule, UsersModule],
})
export class ModulesModule {}


