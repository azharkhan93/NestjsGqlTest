import { UserDeviceTokenEntity } from '../entities/user-device-token.entity';

export abstract class IUserDeviceTokenRepository {
  abstract save(
    fcmToken: string,
    deviceType: string,
    userId: string,
  ): Promise<UserDeviceTokenEntity>;
  abstract findByToken(fcmToken: string): Promise<UserDeviceTokenEntity | null>;
  abstract findByUserId(userId: string): Promise<UserDeviceTokenEntity[]>;
  abstract removeByToken(fcmToken: string): Promise<void>;
}
