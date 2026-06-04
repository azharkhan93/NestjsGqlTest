import { NotificationEntity } from '../entities/notification.entity';

export abstract class INotificationRepository {
  abstract create(data: {
    userId: string;
    title: string;
    body: string;
  }): Promise<NotificationEntity>;
  abstract findByUserId(userId: string): Promise<NotificationEntity[]>;
  abstract markAsRead(id: string): Promise<NotificationEntity | null>;
}
