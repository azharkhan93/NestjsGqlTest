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
      include: { pricings: true },
    });
    return services.map((s) => this.toEntity(s));
  }

  async findOne(id: string): Promise<VendorServiceEntity | null> {
    const result = await this.model.findUnique({
      where: { id },
      include: { pricings: true },
    });
    return result ? this.toEntity(result) : null;
  }

  async create(item: VendorServiceEntity): Promise<VendorServiceEntity> {
    const data = this.toPrisma(item);
    const pricingsData = item.pricings && item.pricings.length > 0
      ? {
          create: item.pricings.map((p) => ({
            categoryId: p.categoryId,
            price: p.price,
          })),
        }
      : undefined;

    const result = await this.model.create({
      data: {
        ...data,
        pricings: pricingsData,
      },
      include: { pricings: true },
    });
    return this.toEntity(result);
  }

  async update(
    id: string,
    item: Partial<VendorServiceEntity>,
  ): Promise<VendorServiceEntity | null> {
    const data = this.toPrisma(item as VendorServiceEntity);
    delete data.pricings;

    const pricingsData = item.pricings
      ? {
          deleteMany: {},
          create: item.pricings.map((p) => ({
            categoryId: p.categoryId,
            price: p.price,
          })),
        }
      : undefined;

    const result = await this.model.update({
      where: { id },
      data: {
        ...data,
        pricings: pricingsData,
      },
      include: { pricings: true },
    });
    return result ? this.toEntity(result) : null;
  }

  toEntity(model: any): VendorServiceEntity {
    return new VendorServiceEntity({
      ...model,
      deletedAt: model.deletedAt ?? undefined,
      availableAtHome: model.availableAtHome,
      availableAtCenter: model.availableAtCenter,
      pricings: model.pricings
        ? model.pricings.map((p: any) => ({
            categoryId: p.categoryId,
            price: p.price,
          }))
        : undefined,
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
      availableAtHome: entity.availableAtHome,
      availableAtCenter: entity.availableAtCenter,
    };
  }
}
