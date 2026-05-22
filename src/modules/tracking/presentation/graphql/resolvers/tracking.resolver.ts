import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Args,
  ID,
  Float,
  Int,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TrackingService } from '../../../application/services/tracking.service';
import { DriverLocationType } from '../types/driver-location.type';

@Resolver(() => DriverLocationType)
export class TrackingResolver {
  constructor(
    private readonly service: TrackingService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => DriverLocationType, { nullable: true })
  async driverLocation(
    @Args('bookingId', { type: () => ID }) bookingId: string,
  ): Promise<DriverLocationType | null> {
    return this.service.getLocation(bookingId);
  }

  @Mutation(() => DriverLocationType)
  async updateDriverLocation(
    @Args('bookingId', { type: () => ID }) bookingId: string,
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('status') status: string,
    @Args('eta', { type: () => Int }) eta: number,
  ): Promise<DriverLocationType> {
    return this.service.updateLocation(
      bookingId,
      latitude,
      longitude,
      status,
      eta,
    );
  }

  @Subscription(() => DriverLocationType, {
    resolve: (payload) => payload.driverLocationUpdated,
  })
  driverLocationUpdated(
    @Args('bookingId', { type: () => ID }) bookingId: string,
  ) {
    return this.pubSub.asyncIterableIterator(
      `driverLocationUpdated:${bookingId}`,
    );
  }
}
