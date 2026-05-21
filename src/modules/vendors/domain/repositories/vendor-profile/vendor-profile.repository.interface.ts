import { IRepository } from '@common/domain/repositories';
import { VendorProfileEntity } from '../../entities';

export abstract class IVendorProfileRepository extends IRepository<VendorProfileEntity> {
  abstract findByUserId(userId: string): Promise<VendorProfileEntity | null>;
  abstract upsertByUserId(entity: VendorProfileEntity): Promise<VendorProfileEntity>;
}
