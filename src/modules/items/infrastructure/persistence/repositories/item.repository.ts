import { Injectable } from '@nestjs/common';
import { IItemRepository } from '../../../domain/repositories/item.repository.interface';
import { ItemEntity } from '../../../domain/entities/item.entity';
import { InMemoryRepository } from '../../../../../common/infrastructure/persistence/in-memory.repository';

@Injectable()
export class ItemRepository
  extends InMemoryRepository<ItemEntity>
  implements IItemRepository {}
