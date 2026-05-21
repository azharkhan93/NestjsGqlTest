import { BaseEntity } from '@common/domain/entities';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class BookingEntity extends BaseEntity {
  userId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<BookingEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<BookingEntity>): BookingEntity {
    return new BookingEntity(data);
  }
}
