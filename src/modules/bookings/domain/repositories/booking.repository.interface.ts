import { IRepository } from '@common/domain/repositories';
import { BookingEntity, BookingStatus } from '../entities';

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
