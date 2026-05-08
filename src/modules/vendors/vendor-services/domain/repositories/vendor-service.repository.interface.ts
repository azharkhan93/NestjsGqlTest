import { IRepository } from '@common/domain/repositories';
import { VendorServiceEntity } from '../entities';

export abstract class IVendorServiceRepository extends IRepository<VendorServiceEntity> {
  abstract findByVendorProfileId(vendorProfileId: string): Promise<VendorServiceEntity[]>;
}
