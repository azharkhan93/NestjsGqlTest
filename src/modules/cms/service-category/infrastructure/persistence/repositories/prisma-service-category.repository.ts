import { Injectable } from '@nestjs/common';
import { PrismaRepository, PrismaService } from '@common/infrastructure/persistence';
import { ServiceCategoryEntity } from '@modules/cms/service-category/domain/entities';
import { ServiceCategory as PrismaServiceCategory } from '@prisma/client';
import { IServiceCategoryRepository } from '@modules/cms/service-category/domain/repositories';

@Injectable()
export class PrismaServiceCategoryRepository
  extends PrismaRepository<ServiceCategoryEntity, PrismaServiceCategory>
  implements IServiceCategoryRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'serviceCategory');
  }

  async createBulk(categories: ServiceCategoryEntity[]): Promise<ServiceCategoryEntity[]> {
    const data = categories.map((cat) => this.toPrisma(cat));
    await this.model.createMany({ data });
    return this.findAll();
  }

  async syncBulk(categories: Partial<ServiceCategoryEntity>[]): Promise<ServiceCategoryEntity[]> {
    return await this.prisma.$transaction(async (tx) => {
      const activeIds = categories.filter((c) => c.id).map((c) => c.id!);

      // 1. Mark as deleted those not in the activeIds list
      await tx.serviceCategory.updateMany({
        where: {
          id: { notIn: activeIds },
          deletedAt: null,
        },
        data: { deletedAt: new Date() },
      });

      const results: ServiceCategoryEntity[] = [];

      // 2. Upsert each category
      for (const cat of categories) {
        let saved;
        if (cat.id && cat.id.length > 20) {
          saved = await tx.serviceCategory.upsert({
            where: { id: cat.id },
            create: {
              name: cat.name!,
              icon: cat.icon!,
            },
            update: {
              name: cat.name,
              icon: cat.icon,
              deletedAt: null,
            },
          });
        } else {
          saved = await tx.serviceCategory.create({
            data: {
              name: cat.name!,
              icon: cat.icon!,
            },
          });
        }
        results.push(this.toEntity(saved));
      }

      return results;
    });
  }

  // Soft delete version of delete
  async delete(id: string): Promise<void> {
    await this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Alias for domain layer if they prefer findById
  async findById(id: string): Promise<ServiceCategoryEntity | null> {
    return this.findOne(id);
  }

  // Override base methods to support soft-delete
  override async findAll(): Promise<ServiceCategoryEntity[]> {
    const items = await this.model.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return items.map((item) => this.toEntity(item));
  }

  override async findOne(id: string): Promise<ServiceCategoryEntity | null> {
    const item = await this.model.findFirst({
      where: { id, deletedAt: null },
    });
    return item ? this.toEntity(item) : null;
  }

  override async remove(id: string): Promise<ServiceCategoryEntity | null> {
    const result = await this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return this.toEntity(result);
  }

  toEntity(model: PrismaServiceCategory): ServiceCategoryEntity {
    return new ServiceCategoryEntity({
      id: model.id,
      name: model.name,
      icon: model.icon,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  toPrisma(entity: ServiceCategoryEntity): any {
    return {
      name: entity.name,
      icon: entity.icon,
      deletedAt: entity.deletedAt,
    };
  }
}
