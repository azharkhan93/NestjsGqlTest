import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { GqlAuthGuard } from '@common/presentation/guards';
import { CurrentUser } from '@common/presentation/decorators';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { ReviewsService } from '@modules/reviews/application/services/reviews.service';
import { BookingService } from '@modules/bookings/application/services/booking.service';
import { ReviewType } from '@modules/reviews/presentation/graphql/types/review.type';
import { CreateReviewInput } from '@modules/reviews/presentation/graphql/inputs/create-review.input';
import { BookingType } from '@modules/bookings/presentation/graphql/types/booking.type';
import { BookingDataLoader } from '@common/infrastructure/dataloaders/booking';

@Resolver(() => ReviewType)
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly bookingService: BookingService,
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
  @UseGuards(GqlAuthGuard)
  async createReview(
    @Args('input') input: CreateReviewInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ReviewType> {
    const booking = await this.bookingService.getBookingById(input.bookingId);
    if (!booking || booking.userId !== user.sub) {
      throw new ForbiddenException(
        'You are not authorized to create a review for this booking',
      );
    }
    const res = await this.reviewsService.createReview(input);
    return { ...res, comment: res.comment ?? undefined } as ReviewType;
  }
}
