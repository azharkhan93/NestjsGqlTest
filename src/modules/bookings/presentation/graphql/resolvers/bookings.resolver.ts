import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BookingStatus as PrismaBookingStatus } from '@prisma/client';
import { BookingService } from '../../../application/services/booking.service';
import { BookingStatus } from '../../../domain/entities/booking.entity';
import { BookingType } from '../types/booking.type';
import { CreateBookingInput } from '../inputs/create-booking.input';

@Resolver(() => BookingType)
export class BookingsResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => [BookingType], { name: 'customerBookings' })
  async getCustomerBookings(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('status', { type: () => PrismaBookingStatus, nullable: true })
    status?: PrismaBookingStatus,
  ): Promise<BookingType[]> {
    const bookings = await this.bookingService.getCustomerBookings(
      userId,
      status as unknown as BookingStatus,
    );
    return bookings as unknown as BookingType[];
  }

  @Query(() => [BookingType], { name: 'vendorBookings' })
  async getVendorBookings(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('status', { type: () => PrismaBookingStatus, nullable: true })
    status?: PrismaBookingStatus,
  ): Promise<BookingType[]> {
    const bookings = await this.bookingService.getVendorBookings(
      vendorProfileId,
      status as unknown as BookingStatus,
    );
    return bookings as unknown as BookingType[];
  }

  @Query(() => BookingType, { name: 'bookingById' })
  async getBookingById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BookingType> {
    const booking = await this.bookingService.getBookingById(id);
    return booking as unknown as BookingType;
  }

  @Mutation(() => BookingType)
  async createBooking(
    @Args('input') input: CreateBookingInput,
  ): Promise<BookingType> {
    const booking = await this.bookingService.createBooking(input);
    return booking as unknown as BookingType;
  }

  @Mutation(() => BookingType)
  async updateBookingStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => PrismaBookingStatus })
    status: PrismaBookingStatus,
  ): Promise<BookingType> {
    const booking = await this.bookingService.updateBookingStatus(
      id,
      status as unknown as BookingStatus,
    );
    return booking as unknown as BookingType;
  }
}
