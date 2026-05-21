import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpsertCustomerProfileInput {
  @Field()
  name: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  location?: string;
}
