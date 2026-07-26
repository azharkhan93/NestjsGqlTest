import { IRepository } from '@common/domain/repositories';
import { DisputeEntity } from '../entities/dispute.entity';

export abstract class IDisputeRepository extends IRepository<DisputeEntity> {
  abstract findByBookingId(bookingId: string): Promise<DisputeEntity | null>;
}
