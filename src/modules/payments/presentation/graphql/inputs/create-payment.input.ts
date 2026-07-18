import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  customerProfileId: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
