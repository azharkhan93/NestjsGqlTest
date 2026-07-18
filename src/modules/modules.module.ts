import { Module } from '@nestjs/common';

import { RolesModule } from './roles/roles.module';
import { TwilioModule } from './twilio/twilio.module';
import { VerificationModule } from './verification/verification.module';
import { VendorsModule } from './vendors/vendors.module';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';
import { AdminModule } from './admin/admin.module';
import { CmsModule } from './cms';
import { CustomersModule } from './customers/customers.module';
import { TrackingModule } from './tracking/tracking.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    RolesModule,
    TwilioModule,
    VerificationModule,
    VendorsModule,
    UsersModule,
    MediaModule,
    AdminModule,
    CmsModule,
    CustomersModule,
    TrackingModule,
    NotificationsModule,
    PaymentsModule,
  ],
})
export class ModulesModule {}
