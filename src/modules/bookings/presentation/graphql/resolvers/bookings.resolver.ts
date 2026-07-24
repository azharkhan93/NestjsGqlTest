import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';
import { BookingsService } from '../../../application/services/bookings.service';
import { BookingType } from '../types/booking.type';
import { CreateBookingInput } from '../inputs/create-booking.input';

@Resolver(() => BookingType)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Query(() => [BookingType], { name: 'customerBookings' })
  async getCustomerBookings(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('status', { type: () => BookingStatus, nullable: true })
    status?: BookingStatus,
  ): Promise<BookingType[]> {
    const bookings = await this.bookingsService.getCustomerBookings(userId, status);
    return bookings.map(b => ({
      ...b,
      vendorProfile: b.service?.vendorProfile ?? undefined,
      totalPrice: b.service?.price ?? 0,
    })) as unknown as BookingType[];
  }

  @Query(() => [BookingType], { name: 'vendorBookings' })
  async getVendorBookings(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('status', { type: () => BookingStatus, nullable: true })
    status?: BookingStatus,
  ): Promise<BookingType[]> {
    const bookings = await this.bookingsService.getVendorBookings(vendorProfileId, status);
    return bookings.map(b => ({
      ...b,
      vendorProfile: b.service?.vendorProfile ?? undefined,
      totalPrice: b.service?.price ?? 0,
    })) as unknown as BookingType[];
  }

  @Query(() => BookingType, { name: 'bookingById' })
  async getBookingById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BookingType> {
    const b = await this.bookingsService.getBookingById(id);
    return {
      ...b,
      vendorProfile: b.service?.vendorProfile ?? undefined,
      totalPrice: b.service?.price ?? 0,
    } as unknown as BookingType;
  }

  @Mutation(() => BookingType)
  async createBooking(
    @Args('input') input: CreateBookingInput,
  ): Promise<BookingType> {
    const b = await this.bookingsService.createBooking(input);
    return {
      ...b,
      vendorProfile: b.service?.vendorProfile ?? undefined,
      totalPrice: b.service?.price ?? 0,
    } as unknown as BookingType;
  }

  @Mutation(() => BookingType)
  async updateBookingStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => BookingStatus }) status: BookingStatus,
  ): Promise<BookingType> {
    const b = await this.bookingsService.updateBookingStatus(id, status);
    return {
      ...b,
      vendorProfile: b.service?.vendorProfile ?? undefined,
      totalPrice: b.service?.price ?? 0,
    } as unknown as BookingType;
  }
}
