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
  Prisma,
} from '@prisma/client';
import { IBookingRepository } from '@modules/bookings/domain/repositories';
import { VendorServiceEntity } from '@modules/vendors/vendor-services/domain/entities/vendor-service.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { VendorProfileEntity } from '@modules/vendors/domain/entities/vendor-profile/vendor-profile.entity';

export type PrismaBookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    service: {
      include: {
        vendorProfile: true;
      };
    };
    user: true;
  };
}>;

@Injectable()
export class BookingRepository
  extends PrismaRepository<BookingEntity, PrismaBooking>
  implements IBookingRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'booking');
  }

  async findByUserId(userId: string): Promise<BookingEntity[]> {
    return this.findByUserIdAndStatus(userId);
  }

  async findByUserIdAndStatus(
    userId: string,
    status?: BookingStatus,
  ): Promise<BookingEntity[]> {
    const results = await this.model.findMany({
      where: {
        userId,
        ...(status ? { status: status as PrismaBookingStatus } : {}),
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
    return results.map((result: PrismaBookingWithRelations) =>
      this.toEntityWithRelations(result),
    );
  }

  async findByVendorProfileIdAndStatus(
    vendorProfileId: string,
    status?: BookingStatus,
  ): Promise<BookingEntity[]> {
    const results = await this.model.findMany({
      where: {
        service: {
          vendorProfileId,
        },
        ...(status ? { status: status as PrismaBookingStatus } : {}),
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
    return results.map((result: PrismaBookingWithRelations) =>
      this.toEntityWithRelations(result),
    );
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
      include: {
        service: {
          include: {
            vendorProfile: true,
          },
        },
        user: true,
      },
    });
    return result ? this.toEntityWithRelations(result) : null;
  }

  override async findAll(): Promise<BookingEntity[]> {
    const results = await this.model.findMany({
      orderBy: { scheduledAt: 'desc' },
    });
    return results.map((result) => this.toEntity(result));
  }

  toEntityWithRelations(model: PrismaBookingWithRelations): BookingEntity {
    const entity = this.toEntity(model);
    if (model.service) {
      entity.service = new VendorServiceEntity({
        id: model.service.id,
        vendorProfileId: model.service.vendorProfileId,
        name: model.service.name,
        description: model.service.description ?? undefined,
        price: model.service.price,
        duration: model.service.duration,
        location: model.service.location,
        features: model.service.features,
        images: model.service.images,
        categoryId: model.service.categoryId,
        availableAtHome: model.service.availableAtHome,
        availableAtCenter: model.service.availableAtCenter,
        createdAt: model.service.createdAt,
        updatedAt: model.service.updatedAt,
      });
      if (model.service.vendorProfile) {
        entity.vendorProfile = new VendorProfileEntity({
          id: model.service.vendorProfile.id,
          userId: model.service.vendorProfile.userId,
          businessName: model.service.vendorProfile.businessName,
          description: model.service.vendorProfile.description ?? undefined,
          imageUri: model.service.vendorProfile.imageUri ?? undefined,
          gstNumber: model.service.vendorProfile.gstNumber ?? undefined,
          contactNumber: model.service.vendorProfile.contactNumber ?? undefined,
          address: model.service.vendorProfile.address ?? undefined,
          serviceRadius: model.service.vendorProfile.serviceRadius ?? undefined,
          operatingHours:
            model.service.vendorProfile.operatingHours ?? undefined,
          whyChooseMe: model.service.vendorProfile.whyChooseMe ?? undefined,
          images: model.service.vendorProfile.images,
          createdAt: model.service.vendorProfile.createdAt,
          updatedAt: model.service.vendorProfile.updatedAt,
        });
      }
    }
    if (model.user) {
      entity.user = new UserEntity({
        id: model.user.id,
        email: model.user.email ?? undefined,
        name: model.user.name ?? undefined,
        roleId: model.user.roleId ?? undefined,
        createdAt: model.user.createdAt,
        updatedAt: model.user.updatedAt,
      });
    }
    entity.totalPrice = model.service?.price ?? 0;
    return entity;
  }

  toEntity(model: PrismaBooking): BookingEntity {
    return new BookingEntity({
      id: model.id,
      userId: model.userId,
      serviceId: model.serviceId,
      status: model.status as BookingStatus,
      scheduledAt: model.scheduledAt,
      deletedAt: model.deletedAt ?? undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  toPrisma(entity: BookingEntity): Record<string, unknown> {
    return {
      userId: entity.userId,
      serviceId: entity.serviceId,
      status: entity.status,
      scheduledAt: entity.scheduledAt,
      deletedAt: entity.deletedAt,
    };
  }
}
