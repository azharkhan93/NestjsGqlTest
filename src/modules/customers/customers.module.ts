import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { CustomerProfileService } from './application/services/customer-profile.service';
import { CustomerAddressService } from './application/services/customer-address.service';
import { CustomerProfileResolver } from './presentation/graphql/resolvers/customer-profile.resolver';
import { CustomerAddressResolver } from './presentation/graphql/resolvers/customer-address.resolver';
import { ICustomerProfileRepository } from './domain/repositories/customer-profile.repository.interface';
import { ICustomerAddressRepository } from './domain/repositories/customer-address.repository.interface';
import { CustomerProfileRepository } from './infrastructure/persistence/repositories/customer-profile.repository';
import { CustomerAddressRepository } from './infrastructure/persistence/repositories/customer-address.repository';

@Module({
  imports: [CommonModule],
  providers: [
    CustomerProfileService,
    CustomerAddressService,
    CustomerProfileResolver,
    CustomerAddressResolver,
    {
      provide: ICustomerProfileRepository,
      useClass: CustomerProfileRepository,
    },
    {
      provide: ICustomerAddressRepository,
      useClass: CustomerAddressRepository,
    },
  ],
  exports: [CustomerProfileService, CustomerAddressService],
})
export class CustomersModule {}
