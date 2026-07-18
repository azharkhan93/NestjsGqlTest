import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class VerifyPaymentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  razorpaySignature: string;
}
