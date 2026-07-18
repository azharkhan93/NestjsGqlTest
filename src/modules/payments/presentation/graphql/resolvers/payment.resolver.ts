import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentService } from '../../../application/services/payment.service';
import { PaymentType } from '../types/payment.type';
import { CreatePaymentInput } from '../inputs/create-payment.input';
import { VerifyPaymentInput } from '../inputs/verify-payment.input';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';

@Resolver(() => PaymentType)
@UseGuards(GqlAuthGuard)
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  @Query(() => PaymentType, { nullable: true })
  async getPaymentByOrderId(
    @Args('orderId') orderId: string,
  ): Promise<PaymentType | null> {
    return this.paymentRepository.findByOrderId(orderId);
  }

  @Mutation(() => PaymentType)
  async createPayment(
    @Args('input') input: CreatePaymentInput,
  ): Promise<PaymentType> {
    return this.paymentService.createPayment(
      input.customerProfileId,
      input.amount,
    );
  }

  @Mutation(() => PaymentType)
  async verifyPaymentSuccess(
    @Args('input') input: VerifyPaymentInput,
  ): Promise<PaymentType> {
    return this.paymentService.verifyPaymentSuccess(
      input.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature,
    );
  }
}
