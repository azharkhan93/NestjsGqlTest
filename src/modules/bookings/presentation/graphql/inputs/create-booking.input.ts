import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  serviceId: string;

  @Field()
  scheduledAt: Date;
}
