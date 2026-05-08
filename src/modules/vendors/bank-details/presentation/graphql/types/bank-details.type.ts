import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BankDetailsType {
  @Field(() => ID)
  id: string;

  @Field()
  vendorProfileId: string;

  @Field()
  accountHolder: string;

  @Field()
  bankName: string;

  @Field()
  ifscCode: string;

  @Field()
  accountNumber: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
