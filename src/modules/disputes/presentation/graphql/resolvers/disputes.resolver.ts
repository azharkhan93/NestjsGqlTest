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
import { DisputesService } from '@modules/disputes/application/services/disputes.service';
import { BookingService } from '@modules/bookings/application/services/booking.service';
import { DisputeType } from '@modules/disputes/presentation/graphql/types/dispute.type';
import { CreateDisputeInput } from '@modules/disputes/presentation/graphql/inputs/create-dispute.input';
import { BookingType } from '@modules/bookings/presentation/graphql/types/booking.type';
import { BookingDataLoader } from '@common/infrastructure/dataloaders/booking';

@Resolver(() => DisputeType)
@UseGuards(GqlAuthGuard)
export class DisputesResolver {
  constructor(
    private readonly disputesService: DisputesService,
    private readonly bookingService: BookingService,
    private readonly bookingDataLoader: BookingDataLoader,
  ) {}

  @ResolveField(() => BookingType, { nullable: true })
  async booking(@Parent() dispute: DisputeType) {
    if (!dispute.bookingId) return null;
    return this.bookingDataLoader.load(dispute.bookingId);
  }

  @Query(() => DisputeType, { name: 'disputeByBookingId', nullable: true })
  async getDisputeByBookingId(
    @Args('bookingId', { type: () => ID }) bookingId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<DisputeType | null> {
    const booking = await this.bookingService.getBookingById(bookingId);
    if (!booking || booking.userId !== user.sub) {
      throw new ForbiddenException(
        'You are not authorized to view disputes for this booking',
      );
    }
    return this.disputesService.getDisputeByBookingId(bookingId);
  }

  @Mutation(() => DisputeType)
  async createDispute(
    @Args('input') input: CreateDisputeInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<DisputeType> {
    const booking = await this.bookingService.getBookingById(input.bookingId);
    if (!booking || booking.userId !== user.sub) {
      throw new ForbiddenException(
        'You are not authorized to create a dispute for this booking',
      );
    }
    return this.disputesService.createDispute(input);
  }
}
