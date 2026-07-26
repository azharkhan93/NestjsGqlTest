import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationService } from '@modules/notifications/application/services';
import {
  NotificationType,
  UserDeviceTokenType,
} from '@modules/notifications/presentation/graphql/types';
import { RegisterDeviceTokenInput } from '@modules/notifications/presentation/graphql/inputs';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import { CurrentUser } from '@common/presentation/decorators/index';
import { CurrentUserPayload } from '@common/domain/interfaces';

@Resolver()
export class NotificationResolver {
  constructor(private readonly service: NotificationService) {}

  @Mutation(() => UserDeviceTokenType, { name: 'registerDeviceToken' })
  @UseGuards(GqlAuthGuard)
  async registerDeviceToken(
    @Args('input') input: RegisterDeviceTokenInput,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.registerDeviceToken(
      user.sub,
      input.fcmToken,
      input.deviceType,
    );
  }

  @Query(() => [NotificationType], { name: 'getUserNotifications' })
  @UseGuards(GqlAuthGuard)
  async getUserNotifications(@CurrentUser() user: CurrentUserPayload) {
    return this.service.getUserNotifications(user.sub);
  }

  @Mutation(() => NotificationType, {
    name: 'markNotificationAsRead',
    nullable: true,
  })
  @UseGuards(GqlAuthGuard)
  async markNotificationAsRead(@Args('id', { type: () => ID }) id: string) {
    return this.service.markAsRead(id);
  }

  @Mutation(() => Boolean, { name: 'sendBookingNotification' })
  @UseGuards(GqlAuthGuard)
  async sendBookingNotification(
    @Args('bookingId', { type: () => ID }) bookingId: string,
    @Args('type') type: string,
  ) {
    if (type !== 'JOURNEY_START' && type !== 'JOURNEY_HALFWAY') {
      throw new Error(`Invalid booking notification type: ${type}`);
    }
    return this.service.sendBookingNotification(bookingId, type);
  }
}
