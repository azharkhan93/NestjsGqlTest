import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { INotificationRepository } from '@modules/notifications/domain/repositories/notification.repository.interface';
import { NotificationEntity } from '@modules/notifications/domain/entities/notification.entity';
import { Notification as PrismaNotification } from '@prisma/client';

@Injectable()
export class PrismaNotificationRepository
  extends PrismaRepository<NotificationEntity, PrismaNotification>
  implements INotificationRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'notification');
  }

  async create(data: {
    userId: string;
    title: string;
    body: string;
  }): Promise<NotificationEntity> {
    const record = await this.model.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        isRead: false,
      },
    });
    return this.toEntity(record);
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    const records = await this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => this.toEntity(record));
  }

  async markAsRead(id: string): Promise<NotificationEntity | null> {
    const record = await this.model.update({
      where: { id },
      data: { isRead: true },
    });
    return record ? this.toEntity(record) : null;
  }

  toEntity(model: PrismaNotification): NotificationEntity {
    return new NotificationEntity({
      id: model.id,
      userId: model.userId,
      title: model.title,
      body: model.body,
      isRead: model.isRead,
      createdAt: model.createdAt,
    });
  }

  toPrisma(entity: NotificationEntity): Record<string, unknown> {
    return {
      userId: entity.userId,
      title: entity.title,
      body: entity.body,
      isRead: entity.isRead,
    };
  }
}
