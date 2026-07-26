import { Injectable } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { IBookingRepository } from '@modules/bookings/domain/repositories';
import {
  BookingEntity,
  BookingStatus,
} from '@modules/bookings/domain/entities';

export interface CreateBookingCommand {
  serviceId: string;
  scheduledAt: string | Date;
}

@Injectable()
export class BookingService {
  constructor(private readonly repository: IBookingRepository) {}

  async createBooking(input: {
    userId: string;
    serviceId: string;
    scheduledAt: string | Date;
  }): Promise<BookingEntity> {
    const booking = BookingEntity.create({
      userId: input.userId,
      serviceId: input.serviceId,
      status: BookingStatus.PENDING,
      scheduledAt: new Date(input.scheduledAt),
    });
    const created = await this.repository.create(booking);
    return assertFound(
      await this.repository.findOne(created.id),
      `Booking ${created.id}`,
    );
  }

  async getCustomerBookings(
    userId: string,
    status?: BookingStatus,
  ): Promise<BookingEntity[]> {
    return this.repository.findByUserIdAndStatus(userId, status);
  }

  async getVendorBookings(
    vendorProfileId: string,
    status?: BookingStatus,
  ): Promise<BookingEntity[]> {
    return this.repository.findByVendorProfileIdAndStatus(
      vendorProfileId,
      status,
    );
  }

  async getBookingById(id: string): Promise<BookingEntity> {
    return assertFound(await this.repository.findOne(id), `Booking ${id}`);
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingEntity> {
    const booking = await this.getBookingById(id);
    booking.status = status;
    await this.repository.update(id, booking);
    return this.getBookingById(id);
  }

  async create(command: CreateBookingCommand, userId: string) {
    return this.createBooking({ ...command, userId });
  }

  async getUserBookings(userId: string) {
    return this.getCustomerBookings(userId);
  }

  async getServiceBookings(serviceId: string) {
    return this.repository.findByServiceId(serviceId);
  }

  async findById(id: string) {
    return this.getBookingById(id);
  }

  async updateStatus(id: string, status: BookingStatus) {
    return this.updateBookingStatus(id, status);
  }
}
