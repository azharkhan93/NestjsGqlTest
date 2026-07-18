import { Field, ID, ObjectType, registerEnumType, Float } from '@nestjs/graphql';
import { PaymentStatus } from '../../../domain/entities/payment.entity';

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Status of the payment',
});

@ObjectType('Payment')
export class PaymentType {
  @Field(() => ID)
  id: string;

  @Field()
  customerProfileId: string;

  @Field()
  razorpayOrderId: string;

  @Field({ nullable: true })
  razorpayPaymentId?: string;

  @Field({ nullable: true })
  razorpaySignature?: string;

  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;

  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
