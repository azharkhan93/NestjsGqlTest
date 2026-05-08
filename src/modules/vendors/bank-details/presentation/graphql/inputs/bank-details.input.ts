import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpsertBankDetailsInput {
  @Field()
  accountHolder: string;

  @Field()
  bankName: string;

  @Field()
  ifscCode: string;

  @Field()
  accountNumber: string;
}
