import { BaseEntity } from '../../../../common/domain/entities/base.entity';

export class ItemEntity extends BaseEntity {
  name: string;
  description?: string;
}
