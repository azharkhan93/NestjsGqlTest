import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@common/presentation/guards';
import { CurrentUser } from '@common/presentation/decorators';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { assertOwnerOrAdmin } from '@common/application/helpers';
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
  ) {
    return this.reviewsService.getReviewByBookingId(bookingId);
  }

  @Query(() => [ReviewType], { name: 'vendorReviews' })
  async getVendorReviews(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
  ) {
    return this.reviewsService.getVendorReviews(vendorProfileId);
  }

  @Mutation(() => ReviewType)
  @UseGuards(GqlAuthGuard)
  async createReview(
    @Args('input') input: CreateReviewInput,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const booking = await this.bookingService.getBookingById(input.bookingId);
    assertOwnerOrAdmin(
      booking?.userId,
      user,
      'create a review for this booking',
    );
    return this.reviewsService.createReview(input);
  }
}
