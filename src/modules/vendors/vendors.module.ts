/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { VendorProfileService } from './application/services/vendor-profile/vendor-profile.service';
import { VendorProfileResolver } from './presentation/graphql/resolvers/vendor-profile/vendor-profile.resolver';
import { IVendorProfileRepository } from './domain/repositories/vendor-profile/vendor-profile.repository.interface';
import { VendorProfileRepository } from './infrastructure/persistence/repositories/vendor-profile/vendor-profile.repository';
import { BankDetailsService } from './bank-details/application/services/bank-details.service';
import { BankDetailsResolver } from './bank-details/presentation/graphql/resolvers/bank-details.resolver';
import { IBankDetailsRepository } from './bank-details/domain/repositories/bank-details.repository.interface';
import { BankDetailsRepository } from './bank-details/infrastructure/persistence/repositories/bank-details.repository';
import { VendorServiceService } from './vendor-services/application/services';
import { VendorServiceResolver } from './vendor-services/presentation/graphql/resolvers';
import { IVendorServiceRepository } from './vendor-services/domain/repositories';
import { VendorServiceRepository } from './vendor-services/infrastructure/persistence/repositories';
import { AvailabilityService } from './availability/application/services';
import { AvailabilityResolver } from './availability/presentation/graphql/resolvers';
import { IAvailabilityRepository } from './availability/domain/repositories';
import { AvailabilityRepository } from './availability/infrastructure/persistence/repositories';

@Module({
  imports: [CommonModule],
  providers: [
    VendorProfileService,
    VendorProfileResolver,
    { provide: IVendorProfileRepository, useClass: VendorProfileRepository },
    BankDetailsService,
    BankDetailsResolver,
    { provide: IBankDetailsRepository, useClass: BankDetailsRepository },
    VendorServiceService,
    VendorServiceResolver,
    { provide: IVendorServiceRepository, useClass: VendorServiceRepository },
    AvailabilityService,
    AvailabilityResolver,
    { provide: IAvailabilityRepository, useClass: AvailabilityRepository },
  ],
  exports: [VendorProfileService, BankDetailsService, VendorServiceService, AvailabilityService],
})
export class VendorsModule {}
