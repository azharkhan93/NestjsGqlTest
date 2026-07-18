import { IRepository } from '@common/domain/repositories/repository.interface';
import { CustomerAddressEntity } from '../entities/customer-address.entity';

export abstract class ICustomerAddressRepository extends IRepository<CustomerAddressEntity> {
  abstract findByCustomerProfileId(
    customerProfileId: string,
  ): Promise<CustomerAddressEntity[]>;
  abstract createAddress(
    customerProfileId: string,
    data: Partial<CustomerAddressEntity>,
  ): Promise<CustomerAddressEntity>;
  abstract updateAddress(
    id: string,
    data: Partial<CustomerAddressEntity>,
  ): Promise<CustomerAddressEntity>;
}
