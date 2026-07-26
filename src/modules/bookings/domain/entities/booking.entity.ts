import { BaseEntity } from '@common/domain/entities';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { VendorServiceEntity } from '@modules/vendors/vendor-services/domain/entities/vendor-service.entity';
import { VendorProfileEntity } from '@modules/vendors/domain/entities/vendor-profile/vendor-profile.entity';

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
  service?: VendorServiceEntity;
  user?: UserEntity;
  vendorProfile?: VendorProfileEntity;
  totalPrice?: number;
  deletedAt?: Date;

  constructor(partial: Partial<BookingEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<BookingEntity>): BookingEntity {
    return new BookingEntity(data);
  }
}
