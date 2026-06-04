import { BaseEntity } from '@common/domain/entities';

export class UserDeviceTokenEntity extends BaseEntity {
  userId: string;
  fcmToken: string;
  deviceType: string;

  constructor(partial: Partial<UserDeviceTokenEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<UserDeviceTokenEntity>): UserDeviceTokenEntity {
    return new UserDeviceTokenEntity(data);
  }
}
