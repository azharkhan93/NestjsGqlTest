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

  async findByUserId(userId: string): Promise<VendorProfileEntity | null> {
    const profile = await this.model.findUnique({ where: { userId } });
    return profile ? this.toEntity(profile) : null;
  }

  async upsertByUserId(entity: VendorProfileEntity): Promise<VendorProfileEntity> {
    const data = this.toPrisma(entity);
    const result = await this.model.upsert({
      where: { userId: entity.userId },
      update: data,
      create: data,
    });
    return this.toEntity(result);
  }

  toEntity(model: PrismaVendorProfile): VendorProfileEntity {
    return new VendorProfileEntity({
      ...model,
      imageUri: model.imageUri ?? undefined,
      gstNumber: model.gstNumber ?? undefined,
      contactNumber: model.contactNumber ?? undefined,
      address: model.address ?? undefined,
      serviceRadius: model.serviceRadius ?? undefined,
      operatingHours: model.operatingHours ?? undefined,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: VendorProfileEntity): Record<string, unknown> {
    return {
      userId: entity.userId,
      businessName: entity.businessName,
      imageUri: entity.imageUri,
      gstNumber: entity.gstNumber,
      contactNumber: entity.contactNumber,
      address: entity.address,
      serviceRadius: entity.serviceRadius,
      operatingHours: entity.operatingHours,
    };
  }
}
