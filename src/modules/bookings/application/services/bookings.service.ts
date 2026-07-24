import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/persistence';
import { BookingStatus } from '@prisma/client';
import { CreateBookingInput } from '../../presentation/graphql/inputs/create-booking.input';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(input: CreateBookingInput) {
    return this.prisma.booking.create({
      data: {
        userId: input.userId,
        serviceId: input.serviceId,
        scheduledAt: new Date(input.scheduledAt),
        status: BookingStatus.PENDING,
      },
      include: {
        service: {
          include: {
            vendorProfile: true,
          },
        },
        user: true,
      },
    });
  }

  async getCustomerBookings(userId: string, status?: BookingStatus) {
    return this.prisma.booking.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
        deletedAt: null,
      },
      include: {
        service: {
          include: {
            vendorProfile: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVendorBookings(vendorProfileId: string, status?: BookingStatus) {
    return this.prisma.booking.findMany({
      where: {
        service: {
          vendorProfileId,
        },
        ...(status ? { status } : {}),
        deletedAt: null,
      },
      include: {
        service: {
          include: {
            vendorProfile: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            vendorProfile: true,
          },
        },
        user: true,
      },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        service: {
          include: {
            vendorProfile: true,
          },
        },
        user: true,
      },
    });
  }
}
