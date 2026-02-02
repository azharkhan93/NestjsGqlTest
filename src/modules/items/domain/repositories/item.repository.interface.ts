import { UpdateItemInput } from '../../application/dtos/update-item.dto';
import { ItemEntity } from '../entities/item.entity';
import { IRepository } from '../../../../common/domain/repositories/repository.interface';


export abstract class IItemRepository extends IRepository<ItemEntity> {}
