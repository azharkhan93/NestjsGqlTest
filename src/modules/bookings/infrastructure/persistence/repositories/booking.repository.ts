import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import {
  BookingEntity,
  BookingStatus,
} from '@modules/bookings/domain/entities';
import {
  Booking as PrismaBooking,
  BookingStatus as PrismaBookingStatus,
} from '@prisma/client';
import { IBookingRepository } from '@modules/bookings/domain/repositories';

@Injectable()
export class BookingRepository
  extends PrismaRepository<BookingEntity, PrismaBooking>
  implements IBookingRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'booking');
  }

  async findByUserId(userId: string): Promise<BookingEntity[]> {
    const results = await this.model.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'desc' },
    });
    return results.map((result) => this.toEntity(result));
  }

  async findByServiceId(serviceId: string): Promise<BookingEntity[]> {
    const results = await this.model.findMany({
      where: { serviceId },
      orderBy: { scheduledAt: 'desc' },
    });
    return results.map((result) => this.toEntity(result));
  }

  override async findOne(id: string): Promise<BookingEntity | null> {
    const result = await this.model.findUnique({
      where: { id },
    });
    return result ? this.toEntity(result) : null;
  }

  override async findAll(): Promise<BookingEntity[]> {
    const results = await this.model.findMany({
      orderBy: { scheduledAt: 'desc' },
    });
    return results.map((result) => this.toEntity(result));
  }

  toEntity(model: PrismaBooking): BookingEntity {
    return new BookingEntity({
      id: model.id,
      userId: model.userId,
      serviceId: model.serviceId,
      status: model.status as BookingStatus,
      scheduledAt: model.scheduledAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: BookingEntity): Record<string, unknown> {
    return {
      userId: entity.userId,
      serviceId: entity.serviceId,
      status: entity.status as PrismaBookingStatus,
      scheduledAt: entity.scheduledAt,
    };
  }
}
