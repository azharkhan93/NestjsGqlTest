import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateDisputeInput {
  @Field(() => ID)
  bookingId: string;

  @Field()
  reason: string;
}
