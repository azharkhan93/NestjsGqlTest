import { Injectable } from '@nestjs/common';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { CreateReviewInput } from '../../presentation/graphql/inputs/create-review.input';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async createReview(input: CreateReviewInput): Promise<ReviewEntity> {
    const review = ReviewEntity.create({
      bookingId: input.bookingId,
      rating: input.rating,
      comment: input.comment,
    });
    return this.reviewRepository.create(review);
  }

  async getReviewByBookingId(bookingId: string): Promise<ReviewEntity | null> {
    return this.reviewRepository.findByBookingId(bookingId);
  }

  async getVendorReviews(vendorProfileId: string): Promise<ReviewEntity[]> {
    return this.reviewRepository.findByVendorProfileId(vendorProfileId);
  }
}
