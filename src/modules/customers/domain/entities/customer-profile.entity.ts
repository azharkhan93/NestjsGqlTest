import { BaseEntity } from '@common/domain/entities/base.entity';
import { CustomerAddressEntity } from './customer-address.entity';

export class CustomerProfileEntity extends BaseEntity {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  addresses?: CustomerAddressEntity[];
  deletedAt?: Date;

  constructor(partial: Partial<CustomerProfileEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<CustomerProfileEntity>): CustomerProfileEntity {
    return new CustomerProfileEntity(data);
  }
}
