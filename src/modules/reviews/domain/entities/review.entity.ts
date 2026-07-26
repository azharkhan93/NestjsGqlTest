import { BaseEntity } from '@common/domain/entities';

export class ReviewEntity extends BaseEntity {
  bookingId: string;
  rating: number;
  comment?: string;
  deletedAt?: Date;

  constructor(partial: Partial<ReviewEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<ReviewEntity>): ReviewEntity {
    return new ReviewEntity(data);
  }
}
