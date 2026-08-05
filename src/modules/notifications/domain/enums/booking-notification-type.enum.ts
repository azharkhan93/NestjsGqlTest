import { registerEnumType } from '@nestjs/graphql';

export enum BookingNotificationType {
  JOURNEY_START = 'JOURNEY_START',
  JOURNEY_HALFWAY = 'JOURNEY_HALFWAY',
}

registerEnumType(BookingNotificationType, {
  name: 'BookingNotificationType',
  description: 'Valid push notification triggers for a booking journey',
});
