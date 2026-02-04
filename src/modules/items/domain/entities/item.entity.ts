import { BaseEntity } from '@common/domain/entities';

export class ItemEntity extends BaseEntity {
  name: string;
  description?: string;
}
