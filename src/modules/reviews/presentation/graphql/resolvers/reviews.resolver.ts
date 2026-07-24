import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ReviewsService } from '../../../application/services/reviews.service';
import { ReviewType } from '../types/review.type';
import { CreateReviewInput } from '../inputs/create-review.input';

@Resolver(() => ReviewType)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Query(() => ReviewType, { name: 'reviewByBookingId', nullable: true })
  async getReviewByBookingId(
    @Args('bookingId', { type: () => ID }) bookingId: string,
  ): Promise<ReviewType | null> {
    const res = await this.reviewsService.getReviewByBookingId(bookingId);
    if (!res) return null;
    return { ...res, comment: res.comment ?? undefined } as ReviewType;
  }

  @Query(() => [ReviewType], { name: 'vendorReviews' })
  async getVendorReviews(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
  ): Promise<ReviewType[]> {
    const reviews = await this.reviewsService.getVendorReviews(vendorProfileId);
    return reviews.map((r) => ({
      ...r,
      comment: r.comment ?? undefined,
    })) as ReviewType[];
  }

  @Mutation(() => ReviewType)
  async createReview(
    @Args('input') input: CreateReviewInput,
  ): Promise<ReviewType> {
    const res = await this.reviewsService.createReview(input);
    return { ...res, comment: res.comment ?? undefined } as ReviewType;
  }
}
