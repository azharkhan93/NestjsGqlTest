import { IRepository } from '@common/domain/repositories/repository.interface';
import { CustomerProfileEntity } from '../entities/customer-profile.entity';

export abstract class ICustomerProfileRepository extends IRepository<CustomerProfileEntity> {
  abstract findByUserId(userId: string): Promise<CustomerProfileEntity | null>;
  abstract upsert(
    userId: string,
    data: Partial<CustomerProfileEntity>,
  ): Promise<CustomerProfileEntity>;
}
