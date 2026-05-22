import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { CustomerAddressEntity } from '../../../domain/entities/customer-address.entity';
import { ICustomerAddressRepository } from '../../../domain/repositories/customer-address.repository.interface';
import { CustomerAddress as PrismaCustomerAddress } from '@prisma/client';

@Injectable()
export class CustomerAddressRepository
  extends PrismaRepository<CustomerAddressEntity, PrismaCustomerAddress>
  implements ICustomerAddressRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'customerAddress');
  }

  async findByCustomerProfileId(
    customerProfileId: string,
  ): Promise<CustomerAddressEntity[]> {
    const results = await this.model.findMany({
      where: { customerProfileId },
    });
    return results.map((result) => this.toEntity(result));
  }

  async createAddress(
    customerProfileId: string,
    data: Partial<CustomerAddressEntity>,
  ): Promise<CustomerAddressEntity> {
    const result = await this.model.create({
      data: {
        customerProfileId,
        label: data.label!,
        street: data.street!,
        city: data.city!,
        state: data.state!,
        zipCode: data.zipCode!,
        type: data.type!,
      },
    });
    return this.toEntity(result);
  }

  async updateAddress(
    id: string,
    data: Partial<CustomerAddressEntity>,
  ): Promise<CustomerAddressEntity> {
    const result = await this.model.update({
      where: { id },
      data: {
        label: data.label,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        type: data.type,
      },
    });
    return this.toEntity(result);
  }

  toEntity(model: PrismaCustomerAddress): CustomerAddressEntity {
    return new CustomerAddressEntity({
      ...model,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: CustomerAddressEntity): Record<string, unknown> {
    return {
      customerProfileId: entity.customerProfileId,
      label: entity.label,
      street: entity.street,
      city: entity.city,
      state: entity.state,
      zipCode: entity.zipCode,
      type: entity.type,
    };
  }
}
