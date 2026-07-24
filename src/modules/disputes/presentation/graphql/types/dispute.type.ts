import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Dispute')
export class DisputeType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  bookingId: string;

  @Field()
  reason: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
