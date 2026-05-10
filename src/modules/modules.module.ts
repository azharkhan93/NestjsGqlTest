import { Module } from '@nestjs/common';

import { RolesModule } from './roles/roles.module';
import { TwilioModule } from './twilio/twilio.module';
import { VerificationModule } from './verification/verification.module';
import { VendorsModule } from './vendors/vendors.module';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    RolesModule,
    TwilioModule,
    VerificationModule,
    VendorsModule,
    UsersModule,
    MediaModule,
  ],
})
export class ModulesModule {}


