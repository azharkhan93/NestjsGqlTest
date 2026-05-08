import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { VendorProfileService } from './application/services';
import { VendorProfileResolver } from './presentation/graphql/resolvers';
import { IVendorProfileRepository } from './domain/repositories';
import { VendorProfileRepository } from './infrastructure/persistence/repositories';

@Module({
  imports: [CommonModule],
  providers: [
    VendorProfileService,
    VendorProfileResolver,
    {
      provide: IVendorProfileRepository,
      useClass: VendorProfileRepository,
    },
  ],
  exports: [VendorProfileService],
})
export class VendorsModule {}
