import { BaseEntity } from '@common/domain/entities';

export class NotificationEntity extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  isRead: boolean;

  constructor(partial: Partial<NotificationEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<NotificationEntity>): NotificationEntity {
    return new NotificationEntity(data);
  }
}
