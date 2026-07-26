import { IRepository } from '@common/domain/repositories';
import { ReviewEntity } from '../entities/review.entity';

export abstract class IReviewRepository extends IRepository<ReviewEntity> {
  abstract findByBookingId(bookingId: string): Promise<ReviewEntity | null>;
  abstract findByVendorProfileId(
    vendorProfileId: string,
  ): Promise<ReviewEntity[]>;
}
