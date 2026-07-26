import { BaseEntity } from '@common/domain/entities';

export class DisputeEntity extends BaseEntity {
  bookingId: string;
  reason: string;
  status: string;
  deletedAt?: Date;

  constructor(partial: Partial<DisputeEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<DisputeEntity>): DisputeEntity {
    return new DisputeEntity(data);
  }
}
