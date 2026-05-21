import { IRepository } from '@common/domain/repositories';
import { BookingEntity } from '../entities';

export abstract class IBookingRepository extends IRepository<BookingEntity> {
  abstract findByUserId(userId: string): Promise<BookingEntity[]>;
  abstract findByServiceId(serviceId: string): Promise<BookingEntity[]>;
}
