import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ReviewsService } from '../../../application/services/reviews.service';
import { ReviewType } from '../types/review.type';
import { CreateReviewInput } from '../inputs/create-review.input';
import { BookingType } from '../../../../bookings/presentation/graphql/types/booking.type';
import { BookingDataLoader } from '@common/infrastructure/dataloaders/booking';

@Resolver(() => ReviewType)
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly bookingDataLoader: BookingDataLoader,
  ) {}

  @ResolveField(() => BookingType, { nullable: true })
  async booking(@Parent() review: ReviewType) {
    if (!review.bookingId) return null;
    return this.bookingDataLoader.load(review.bookingId);
  }

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
