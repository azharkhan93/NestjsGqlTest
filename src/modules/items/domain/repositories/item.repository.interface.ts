import { ItemEntity } from '@modules/items/domain/entities';
import { IRepository } from '@common/domain/repositories/repository.interface';

export abstract class IItemRepository extends IRepository<ItemEntity> {}
