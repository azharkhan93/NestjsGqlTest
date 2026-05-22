import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class DriverLocationType {
  @Field(() => ID)
  bookingId: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field()
  status: string;

  @Field(() => Int)
  eta: number;

  @Field()
  updatedAt: Date;
}
