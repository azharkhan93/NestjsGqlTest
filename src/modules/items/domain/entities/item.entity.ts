import { BaseEntity } from '@common/domain/entities';
import { ItemName } from '@modules/items/domain/value-objects';

export class ItemEntity extends BaseEntity {
  name: ItemName;
  description?: string;
}
