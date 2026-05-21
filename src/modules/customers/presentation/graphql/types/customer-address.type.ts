import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CustomerAddressType {
  @Field(() => ID)
  id: string;

  @Field()
  customerProfileId: string;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
