import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { VendorServiceEntity } from '@modules/vendors/vendor-services/domain/entities';
import { IVendorServiceRepository } from '@modules/vendors/vendor-services/domain/repositories';
import { Service as PrismaServiceType } from '@prisma/client';

@Injectable()
export class VendorServiceRepository
  extends PrismaRepository<VendorServiceEntity, PrismaServiceType>
  implements IVendorServiceRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'service');
  }

  async findByVendorProfileId(
    vendorProfileId: string,
  ): Promise<VendorServiceEntity[]> {
    const services = await this.model.findMany({
      where: { vendorProfileId, deletedAt: null },
    });
    return services.map((s) => this.toEntity(s));
  }

  toEntity(model: PrismaServiceType): VendorServiceEntity {
    return new VendorServiceEntity({
      ...model,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: VendorServiceEntity): Record<string, unknown> {
    return {
      vendorProfileId: entity.vendorProfileId,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      duration: entity.duration,
      location: entity.location,
      features: entity.features,
      images: entity.images,
      categoryId: entity.categoryId,
    };
  }
}
