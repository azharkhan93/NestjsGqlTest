import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BookingService } from '../../../application/services/booking.service';
import {
  BookingEntity,
  BookingStatus,
} from '../../../domain/entities/booking.entity';
import { BookingType } from '../types/booking.type';
import { CreateBookingInput } from '../inputs/create-booking.input';
import { UserType } from '../../../../users/presentation/graphql/types/user.type';
import { VendorServiceType } from '../../../../vendors/vendor-services/presentation/graphql/types/vendor-service.type';
import { UserDataLoader } from '@common/infrastructure/dataloaders/user';
import { ServiceDataLoader } from '@common/infrastructure/dataloaders/service';

@Resolver(() => BookingType)
export class BookingsResolver {
  constructor(
    private readonly bookingService: BookingService,
    private readonly userDataLoader: UserDataLoader,
    private readonly serviceDataLoader: ServiceDataLoader,
  ) {}

  @ResolveField(() => UserType, { nullable: true })
  async user(@Parent() booking: BookingEntity) {
    if (booking.user) return booking.user;
    if (!booking.userId) return null;
    return this.userDataLoader.load(booking.userId);
  }

  @ResolveField(() => VendorServiceType, { nullable: true })
  async service(@Parent() booking: BookingEntity) {
    if (booking.service) return booking.service;
    if (!booking.serviceId) return null;
    return this.serviceDataLoader.load(booking.serviceId);
  }

  @Query(() => [BookingType], { name: 'customerBookings' })
  async getCustomerBookings(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('status', { type: () => BookingStatus, nullable: true })
    status?: BookingStatus,
  ): Promise<BookingEntity[]> {
    return this.bookingService.getCustomerBookings(userId, status);
  }

  @Query(() => [BookingType], { name: 'vendorBookings' })
  async getVendorBookings(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('status', { type: () => BookingStatus, nullable: true })
    status?: BookingStatus,
  ): Promise<BookingEntity[]> {
    return this.bookingService.getVendorBookings(vendorProfileId, status);
  }

  @Query(() => BookingType, { name: 'bookingById' })
  async getBookingById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BookingEntity> {
    return this.bookingService.getBookingById(id);
  }

  @Mutation(() => BookingType)
  async createBooking(
    @Args('input') input: CreateBookingInput,
  ): Promise<BookingEntity> {
    return this.bookingService.createBooking(input);
  }

  @Mutation(() => BookingType)
  async updateBookingStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => BookingStatus })
    status: BookingStatus,
  ): Promise<BookingEntity> {
    return this.bookingService.updateBookingStatus(id, status);
  }
}
