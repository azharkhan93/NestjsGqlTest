import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpsertCustomerAddressInput {
  @Field()
  label: string;

  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zipCode: string;

  @Field()
  type: string; // 'home' | 'work' | 'office'
}
