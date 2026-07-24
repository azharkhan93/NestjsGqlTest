import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => ID)
  bookingId: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;
}
