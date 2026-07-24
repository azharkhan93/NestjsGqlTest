import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

@ObjectType('Review')
export class ReviewType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  bookingId: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
