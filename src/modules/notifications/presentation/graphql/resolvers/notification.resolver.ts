import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { NotificationService } from '@modules/notifications/application/services';
import {
  NotificationType,
  UserDeviceTokenType,
} from '@modules/notifications/presentation/graphql/types';
import { RegisterDeviceTokenInput } from '@modules/notifications/presentation/graphql/inputs';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import { CurrentUser } from '@common/presentation/decorators/index';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { assertOwnerOrAdmin } from '@common/application/helpers';
import { BookingService } from '@modules/bookings/application/services/booking.service';
import { BookingNotificationType } from '@modules/notifications/domain/enums/booking-notification-type.enum';

@Resolver()
@UseGuards(GqlAuthGuard)
export class NotificationResolver {
  constructor(
    private readonly service: NotificationService,
    private readonly bookingService: BookingService,
  ) {}

  @Mutation(() => UserDeviceTokenType, { name: 'registerDeviceToken' })
  async registerDeviceToken(
    @Args('input') input: RegisterDeviceTokenInput,
    @CurrentUser() { sub }: CurrentUserPayload,
  ) {
    return this.service.registerDeviceToken(
      sub,
      input.fcmToken,
      input.deviceType,
    );
  }

  @Query(() => [NotificationType], { name: 'getUserNotifications' })
  async getUserNotifications(@CurrentUser() { sub }: CurrentUserPayload) {
    return this.service.getUserNotifications(sub);
  }

  @Mutation(() => NotificationType, {
    name: 'markNotificationAsRead',
    nullable: true,
  })
  async markNotificationAsRead(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() { sub }: CurrentUserPayload,
  ) {
    const notifications = await this.service.getUserNotifications(sub);
    const belongsToUser = notifications.some((n) => n.id === id);
    if (!belongsToUser) {
      throw new ForbiddenException(
        'You are not authorized to mark this notification as read',
      );
    }
    return this.service.markAsRead(id);
  }

  @Mutation(() => Boolean, { name: 'sendBookingNotification' })
  async sendBookingNotification(
    @Args('bookingId', { type: () => ID }) bookingId: string,
    @Args('type', { type: () => BookingNotificationType })
    type: BookingNotificationType,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    const booking = await this.bookingService.getBookingById(bookingId);
    assertOwnerOrAdmin(
      booking?.userId,
      currentUser,
      'send notifications for this booking',
    );
    return this.service.sendBookingNotification(bookingId, type);
  }
}
