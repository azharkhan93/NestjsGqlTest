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
  async user(@Parent() { userId, user }: BookingEntity) {
    return user ?? (userId ? this.userDataLoader.load(userId) : null);
  }

  @ResolveField(() => VendorServiceType, { nullable: true })
  async service(@Parent() { serviceId, service }: BookingEntity) {
    return (
      service ?? (serviceId ? this.serviceDataLoader.load(serviceId) : null)
    );
  }

  @Query(() => [BookingType], { name: 'customerBookings' })
  async getCustomerBookings(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('status', { type: () => BookingStatus, nullable: true })
    status: BookingStatus | undefined,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    assertOwnerOrAdmin(userId, currentUser, 'view another user bookings');
    return this.bookingService.getCustomerBookings(userId, status);
  }

  @Query(() => [BookingType], { name: 'vendorBookings' })
  async getVendorBookings(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('status', { type: () => BookingStatus, nullable: true })
    status?: BookingStatus,
  ) {
    return this.bookingService.getVendorBookings(vendorProfileId, status);
  }

  @Query(() => BookingType, { name: 'bookingById' })
  async getBookingById(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.assertAndGetBooking(id, currentUser, 'access this booking');
  }

  @Mutation(() => BookingType)
  async createBooking(
    @Args('input') input: CreateBookingInput,
    @CurrentUser() { sub }: CurrentUserPayload,
  ) {
    input.userId = sub;
    return this.bookingService.createBooking(input);
  }

  @Mutation(() => BookingType)
  async updateBookingStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => BookingStatus }) status: BookingStatus,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    await this.assertAndGetBooking(
      id,
      currentUser,
      'update status for this booking',
    );
    return this.bookingService.updateBookingStatus(id, status);
  }

  private async assertAndGetBooking(
    id: string,
    currentUser: CurrentUserPayload,
    action: string,
  ): Promise<BookingEntity> {
    const booking = await this.bookingService.getBookingById(id);
    assertOwnerOrAdmin(booking.userId, currentUser, action);
    return booking;
  }
}
