import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CustomerAddressType } from './customer-address.type';

@ObjectType()
export class CustomerProfileType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  name: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => [CustomerAddressType], { nullable: 'itemsAndList' })
  addresses?: CustomerAddressType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
