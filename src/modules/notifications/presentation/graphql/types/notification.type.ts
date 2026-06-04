import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class NotificationType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class UserDeviceTokenType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  fcmToken: string;

  @Field()
  deviceType: string;

  @Field()
  createdAt: Date;
}
