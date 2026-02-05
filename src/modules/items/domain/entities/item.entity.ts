import { BaseEntity } from '@common/domain/entities';
import { ItemName } from '../value-objects/item-name.vo';

export class ItemEntity extends BaseEntity {
  name: ItemName;
  description?: string;
}
