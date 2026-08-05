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
import { UserRole } from '@common/domain/enums';
import { BookingService } from '@modules/bookings/application/services/booking.service';
import {
  BookingEntity,
  BookingStatus,
} from '@modules/bookings/domain/entities/booking.entity';
import { BookingType } from '@modules/bookings/presentation/graphql/types/booking.type';
import { CreateBookingInput } from '@modules/bookings/presentation/graphql/inputs/create-booking.input';
import { UserType } from '@modules/users/presentation/graphql/types/user.type';
import { VendorServiceType } from '@modules/vendors/vendor-services/presentation/graphql/types/vendor-service.type';
import { UserDataLoader } from '@common/infrastructure/dataloaders/user';
import { ServiceDataLoader } from '@common/infrastructure/dataloaders/service';

@Resolver(() => BookingType)
@UseGuards(GqlAuthGuard)
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
    status: BookingStatus | undefined,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<BookingEntity[]> {
    if (
      currentUser.sub !== userId &&
      currentUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'You are not authorized to view another user bookings',
      );
    }
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
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<BookingEntity> {
    const booking = await this.bookingService.getBookingById(id);
    if (
      booking.userId !== currentUser.sub &&
      currentUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'You are not authorized to access this booking',
      );
    }
    return booking;
  }

  @Mutation(() => BookingType)
  async createBooking(
    @Args('input') input: CreateBookingInput,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<BookingEntity> {
    input.userId = currentUser.sub;
    return this.bookingService.createBooking(input);
  }

  @Mutation(() => BookingType)
  async updateBookingStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => BookingStatus })
    status: BookingStatus,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<BookingEntity> {
    const booking = await this.bookingService.getBookingById(id);
    if (
      booking.userId !== currentUser.sub &&
      currentUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'You are not authorized to update status for this booking',
      );
    }
    return this.bookingService.updateBookingStatus(id, status);
  }
}
