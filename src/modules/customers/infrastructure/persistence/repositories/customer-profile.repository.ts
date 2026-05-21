import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { CustomerProfileEntity, CustomerAddressEntity } from '../../../domain/entities';
import { ICustomerProfileRepository } from '../../../domain/repositories/customer-profile.repository.interface';
import { CustomerProfile as PrismaCustomerProfile, CustomerAddress as PrismaCustomerAddress } from '@prisma/client';

@Injectable()
export class CustomerProfileRepository
  extends PrismaRepository<CustomerProfileEntity, PrismaCustomerProfile>
  implements ICustomerProfileRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'customerProfile');
  }

  async findByUserId(userId: string): Promise<CustomerProfileEntity | null> {
    const result = await this.model.findUnique({
      where: { userId },
      include: { addresses: true },
    });
    return result ? this.toEntity(result) : null;
  }

  async upsert(
    userId: string,
    data: Partial<CustomerProfileEntity>,
  ): Promise<CustomerProfileEntity> {
    const result = await this.model.upsert({
      where: { userId },
      update: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        location: data.location,
      },
      create: {
        userId,
        name: data.name!,
        phone: data.phone!,
        email: data.email,
        location: data.location,
      },
      include: { addresses: true },
    });
    return this.toEntity(result);
  }

  toEntity(model: PrismaCustomerProfile & { addresses?: PrismaCustomerAddress[] }): CustomerProfileEntity {
    return new CustomerProfileEntity({
      ...model,
      email: model.email ?? undefined,
      location: model.location ?? undefined,
      deletedAt: model.deletedAt ?? undefined,
      addresses: model.addresses?.map((addr) => new CustomerAddressEntity({
        ...addr,
        deletedAt: addr.deletedAt ?? undefined,
      })),
    });
  }

  toPrisma(entity: CustomerProfileEntity): Record<string, unknown> {
    return {
      userId: entity.userId,
      name: entity.name,
      phone: entity.phone,
      email: entity.email,
      location: entity.location,
    };
  }
}
