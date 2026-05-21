import { Injectable } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { ICustomerAddressRepository } from '../../domain/repositories/customer-address.repository.interface';
import { CustomerAddressEntity } from '../../domain/entities/customer-address.entity';

@Injectable()
export class CustomerAddressService {
  constructor(private readonly repository: ICustomerAddressRepository) {}

  async findByCustomerProfileId(customerProfileId: string): Promise<CustomerAddressEntity[]> {
    return this.repository.findByCustomerProfileId(customerProfileId);
  }

  async create(
    customerProfileId: string,
    data: Partial<CustomerAddressEntity>,
  ): Promise<CustomerAddressEntity> {
    return this.repository.createAddress(customerProfileId, data);
  }

  async update(
    id: string,
    data: Partial<CustomerAddressEntity>,
  ): Promise<CustomerAddressEntity> {
    return assertFound(
      await this.repository.updateAddress(id, data),
      `Customer address ${id}`,
    );
  }

  async delete(id: string): Promise<boolean> {
    assertFound(await this.repository.remove(id), `Customer address ${id}`);
    return true;
  }
}
