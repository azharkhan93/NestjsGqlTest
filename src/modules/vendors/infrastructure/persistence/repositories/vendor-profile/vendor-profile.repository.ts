import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { VendorProfileEntity } from '@modules/vendors/domain/entities';
import { VendorProfile as PrismaVendorProfile } from '@prisma/client';
import { IVendorProfileRepository } from '@modules/vendors/domain/repositories';

@Injectable()
export class VendorProfileRepository
  extends PrismaRepository<VendorProfileEntity, PrismaVendorProfile>
  implements IVendorProfileRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'vendorProfile');
  }

  override async findOne(id: string): Promise<VendorProfileEntity | null> {
    const result = await this.model.findUnique({
      where: { id },
      include: { categories: true },
    });
    return result ? this.toEntity(result) : null;
  }

  override async findAll(): Promise<VendorProfileEntity[]> {
    const results = await this.model.findMany({
      include: { categories: true },
    });
    return results.map((result) => this.toEntity(result));
  }

  override async create(
    item: VendorProfileEntity,
  ): Promise<VendorProfileEntity> {
    const data = this.toPrisma(item);
    const result = await this.model.create({
      data,
      include: { categories: true },
    });
    return this.toEntity(result);
  }

  override async update(
    id: string,
    item: Partial<VendorProfileEntity>,
  ): Promise<VendorProfileEntity | null> {
    const data = this.toPrisma(item as VendorProfileEntity);
    const result = await this.model.update({
      where: { id },
      data,
      include: { categories: true },
    });
    return result ? this.toEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<VendorProfileEntity | null> {
    const profile = await this.model.findUnique({
      where: { userId },
      include: { categories: true },
    });
    return profile ? this.toEntity(profile) : null;
  }

  async upsertByUserId(
    entity: VendorProfileEntity,
  ): Promise<VendorProfileEntity> {
    const data = this.toPrisma(entity);
    const result = await this.model.upsert({
      where: { userId: entity.userId },
      update: data,
      create: data,
      include: { categories: true },
    });
    return this.toEntity(result);
  }

  async search(query: string): Promise<VendorProfileEntity[]> {
    const results = await this.model.findMany({
      where: {
        OR: [
          { businessName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          {
            services: {
              some: { name: { contains: query, mode: 'insensitive' } },
            },
          },
        ],
      },
      include: { categories: true },
    });
    return results.map((result) => this.toEntity(result));
  }

  toEntity(
    model: PrismaVendorProfile & { categories?: any[] },
  ): VendorProfileEntity {
    return new VendorProfileEntity({
      ...model,
      imageUri: model.imageUri ?? undefined,
      gstNumber: model.gstNumber ?? undefined,
      contactNumber: model.contactNumber ?? undefined,
      address: model.address ?? undefined,
      serviceRadius: model.serviceRadius ?? undefined,
      operatingHours: model.operatingHours ?? undefined,
      description: model.description ?? undefined,
      whyChooseMe: model.whyChooseMe ?? undefined,
      images: model.images ?? [],
      categoryIds: model.categories ? model.categories.map((c) => c.id) : [],
      categories: model.categories
        ? model.categories.map((c) => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            deletedAt: c.deletedAt,
          }))
        : [],
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: VendorProfileEntity): Record<string, unknown> {
    const data: Record<string, unknown> = {
      userId: entity.userId,
      businessName: entity.businessName,
      imageUri: entity.imageUri,
      gstNumber: entity.gstNumber,
      contactNumber: entity.contactNumber,
      address: entity.address,
      serviceRadius: entity.serviceRadius,
      operatingHours: entity.operatingHours,
      description: entity.description,
      whyChooseMe: entity.whyChooseMe,
      images: entity.images,
    };

    if (entity.categoryIds) {
      data.categories = {
        set: entity.categoryIds.map((id) => ({ id })),
      };
    }

    return data;
  }
}
