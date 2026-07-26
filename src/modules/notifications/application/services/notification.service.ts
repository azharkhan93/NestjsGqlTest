import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserDeviceTokenRepository,
  INotificationRepository,
} from '../../domain/repositories';
import {
  UserDeviceTokenEntity,
  NotificationEntity,
} from '../../domain/entities';
import { FcmService } from '../../infrastructure/services/fcm.service';
import { BookingService } from '@modules/bookings/application/services/booking.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userDeviceTokenRepo: IUserDeviceTokenRepository,
    private readonly notificationRepo: INotificationRepository,
    private readonly fcmService: FcmService,
    private readonly bookingService: BookingService,
  ) {}

  async registerDeviceToken(
    userId: string,
    fcmToken: string,
    deviceType: string,
  ): Promise<UserDeviceTokenEntity> {
    return this.userDeviceTokenRepo.save(fcmToken, deviceType, userId);
  }

  async getUserNotifications(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepo.findByUserId(userId);
  }

  async markAsRead(id: string): Promise<NotificationEntity | null> {
    return this.notificationRepo.markAsRead(id);
  }

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<boolean> {
    // 1. Save to notification history database
    await this.notificationRepo.create({ userId, title, body });

    // 2. Fetch all registered tokens for the user
    const tokens = await this.userDeviceTokenRepo.findByUserId(userId);
    if (tokens.length === 0) {
      return false;
    }

    // 3. Dispatch to all devices
    const results = await Promise.all(
      tokens.map((tokenEntity) =>
        this.fcmService.sendPushNotification(
          tokenEntity.fcmToken,
          title,
          body,
          data,
        ),
      ),
    );

    return results.some((res) => res === true);
  }

  async sendBookingNotification(
    bookingId: string,
    type: 'JOURNEY_START' | 'JOURNEY_HALFWAY',
  ): Promise<boolean> {
    const booking = await this.bookingService.getBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
    }

    const customerUserId = booking.userId;
    const vendorName = booking.vendorProfile?.businessName ?? 'Your Vendor';

    let title = '';
    let body = '';

    if (type === 'JOURNEY_START') {
      title = vendorName;
      body = `${vendorName} is on the way to your location (within 5 minutes)`;
    } else if (type === 'JOURNEY_HALFWAY') {
      title = vendorName;
      body = `${vendorName} is halfway to your location`;
    } else {
      throw new Error(`Invalid booking notification type: ${type}`);
    }

    return this.sendPushNotification(customerUserId, title, body, {
      bookingId,
      type,
    });
  }
}
