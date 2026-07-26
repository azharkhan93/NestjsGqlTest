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
import { DisputesService } from '../../../application/services/disputes.service';
import { DisputeType } from '../types/dispute.type';
import { CreateDisputeInput } from '../inputs/create-dispute.input';
import { BookingType } from '../../../../bookings/presentation/graphql/types/booking.type';
import { BookingDataLoader } from '@common/infrastructure/dataloaders/booking';

@Resolver(() => DisputeType)
@UseGuards(GqlAuthGuard)
export class DisputesResolver {
  constructor(
    private readonly disputesService: DisputesService,
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
  ): Promise<DisputeType | null> {
    return this.disputesService.getDisputeByBookingId(bookingId);
  }

  @Mutation(() => DisputeType)
  async createDispute(
    @Args('input') input: CreateDisputeInput,
  ): Promise<DisputeType> {
    return this.disputesService.createDispute(input);
  }
}
