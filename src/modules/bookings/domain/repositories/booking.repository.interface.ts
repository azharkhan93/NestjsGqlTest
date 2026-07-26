import { IRepository } from '@common/domain/repositories';
import { BookingEntity } from '../entities';
import { BookingStatus } from '@prisma/client';

export abstract class IBookingRepository extends IRepository<BookingEntity> {
  abstract findByUserId(userId: string): Promise<BookingEntity[]>;
  abstract findByUserIdAndStatus(
    userId: string,
    status?: BookingStatus,
  ): Promise<BookingEntity[]>;
  abstract findByVendorProfileIdAndStatus(
    vendorProfileId: string,
    status?: BookingStatus,
  ): Promise<BookingEntity[]>;
  abstract findByServiceId(serviceId: string): Promise<BookingEntity[]>;
}
