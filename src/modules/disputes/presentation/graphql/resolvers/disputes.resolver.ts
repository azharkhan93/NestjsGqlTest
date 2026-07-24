import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DisputesService } from '../../../application/services/disputes.service';
import { DisputeType } from '../types/dispute.type';
import { CreateDisputeInput } from '../inputs/create-dispute.input';

@Resolver(() => DisputeType)
export class DisputesResolver {
  constructor(private readonly disputesService: DisputesService) {}

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
