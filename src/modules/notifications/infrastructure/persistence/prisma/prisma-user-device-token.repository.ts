import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { IUserDeviceTokenRepository } from '@modules/notifications/domain/repositories/user-device-token.repository.interface';
import { UserDeviceTokenEntity } from '@modules/notifications/domain/entities/user-device-token.entity';
import { UserDeviceToken as PrismaUserDeviceToken } from '@prisma/client';

@Injectable()
export class PrismaUserDeviceTokenRepository
  extends PrismaRepository<UserDeviceTokenEntity, PrismaUserDeviceToken>
  implements IUserDeviceTokenRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'userDeviceToken');
  }

  async save(
    fcmToken: string,
    deviceType: string,
    userId: string,
  ): Promise<UserDeviceTokenEntity> {
    const record = await this.model.upsert({
      where: { fcmToken },
      update: { userId, deviceType },
      create: { fcmToken, deviceType, userId },
    });
    return this.toEntity(record);
  }

  async findByToken(fcmToken: string): Promise<UserDeviceTokenEntity | null> {
    const record = await this.model.findUnique({ where: { fcmToken } });
    return record ? this.toEntity(record) : null;
  }

  async findByUserId(userId: string): Promise<UserDeviceTokenEntity[]> {
    const records = await this.model.findMany({ where: { userId } });
    return records.map((record) => this.toEntity(record));
  }

  async removeByToken(fcmToken: string): Promise<void> {
    await this.model.deleteMany({ where: { fcmToken } });
  }

  toEntity(model: PrismaUserDeviceToken): UserDeviceTokenEntity {
    return new UserDeviceTokenEntity({
      id: model.id,
      userId: model.userId,
      fcmToken: model.fcmToken,
      deviceType: model.deviceType,
      createdAt: model.createdAt,
    });
  }

  toPrisma(entity: UserDeviceTokenEntity): Record<string, unknown> {
    return {
      userId: entity.userId,
      fcmToken: entity.fcmToken,
      deviceType: entity.deviceType,
    };
  }
}
