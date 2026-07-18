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

  async create(command: CreateBookingCommand, userId: string) {
    const booking = BookingEntity.create({
      userId,
      serviceId: command.serviceId,
      status: BookingStatus.PENDING,
      scheduledAt: new Date(command.scheduledAt),
    });
    return this.repository.create(booking);
  }

  async getUserBookings(userId: string) {
    return this.repository.findByUserId(userId);
  }

  async getServiceBookings(serviceId: string) {
    return this.repository.findByServiceId(serviceId);
  }

  async findById(id: string) {
    return assertFound(await this.repository.findOne(id), `Booking ${id}`);
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.findById(id);
    booking.status = status;
    return this.repository.update(id, booking);
  }
}
