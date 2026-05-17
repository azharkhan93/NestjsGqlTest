import { IRepository } from '@common/domain/repositories';
import { BankDetailsEntity } from '../entities';

export abstract class IBankDetailsRepository extends IRepository<BankDetailsEntity> {
  abstract findByVendorProfileId(
    vendorProfileId: string,
  ): Promise<BankDetailsEntity | null>;
  abstract upsert(
    vendorProfileId: string,
    data: Partial<BankDetailsEntity>,
  ): Promise<BankDetailsEntity>;
}
