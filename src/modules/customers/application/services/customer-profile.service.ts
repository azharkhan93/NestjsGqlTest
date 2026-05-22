import { Injectable } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { ICustomerProfileRepository } from '../../domain/repositories/customer-profile.repository.interface';
import { CustomerProfileEntity } from '../../domain/entities/customer-profile.entity';

@Injectable()
export class CustomerProfileService {
  constructor(private readonly repository: ICustomerProfileRepository) {}

  async upsert(
    userId: string,
    data: Partial<CustomerProfileEntity>,
  ): Promise<CustomerProfileEntity> {
    return this.repository.upsert(userId, data);
  }

  async findByUserId(userId: string): Promise<CustomerProfileEntity | null> {
    return this.repository.findByUserId(userId);
  }

  async findById(id: string): Promise<CustomerProfileEntity> {
    return assertFound(
      await this.repository.findOne(id),
      `Customer profile ${id}`,
    );
  }

  async delete(id: string): Promise<boolean> {
    assertFound(await this.repository.remove(id), `Customer profile ${id}`);
    return true;
  }
}
