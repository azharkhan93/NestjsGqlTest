import { Module, forwardRef } from '@nestjs/common';
import { RolesModule } from '@modules/roles/roles.module';
import { UsersModule } from '@modules/users/users.module';
import { VendorsModule } from '@modules/vendors/vendors.module';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { RoleDataLoader } from './role';
import { UserDataLoader } from './user';
import { ServiceDataLoader } from './service';
import { VendorProfileDataLoader } from './vendor-profile';
import { BookingDataLoader } from './booking';

@Module({
  imports: [
    RolesModule,
    UsersModule,
    VendorsModule,
    forwardRef(() => BookingsModule),
  ],
  providers: [
    RoleDataLoader,
    UserDataLoader,
    ServiceDataLoader,
    VendorProfileDataLoader,
    BookingDataLoader,
  ],
  exports: [
    RoleDataLoader,
    UserDataLoader,
    ServiceDataLoader,
    VendorProfileDataLoader,
    BookingDataLoader,
  ],
})
export class DataLoadersModule {}
