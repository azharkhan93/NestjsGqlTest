import { BaseEntity } from '@common/domain/entities/base.entity';

export class CustomerAddressEntity extends BaseEntity {
  customerProfileId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  type: string; // 'home' | 'work' | 'office'
  deletedAt?: Date;

  constructor(partial: Partial<CustomerAddressEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<CustomerAddressEntity>): CustomerAddressEntity {
    return new CustomerAddressEntity(data);
  }
}
