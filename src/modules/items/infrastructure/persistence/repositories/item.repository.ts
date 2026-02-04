import { Injectable } from '@nestjs/common';
import { IItemRepository } from '@modules/items/domain/repositories/item.repository.interface';
import { ItemEntity } from '@modules/items/domain/entities';
import { PrismaRepository, PrismaService } from '@common/infrastructure/persistence';
import { Item as PrismaItem } from '@prisma/client';

@Injectable()
export class ItemRepository
  extends PrismaRepository<ItemEntity, PrismaItem>
  implements IItemRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'item');
  }

  toEntity(model: PrismaItem): ItemEntity {
    const entity = new ItemEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.description = model.description ?? undefined;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }

  toPrisma(entity: ItemEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }
}
