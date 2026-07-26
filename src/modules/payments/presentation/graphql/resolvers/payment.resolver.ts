import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentService } from '../../../application/services/payment.service';
import { PaymentType } from '../types/payment.type';
import { CreatePaymentInput } from '../inputs/create-payment.input';
import { VerifyPaymentInput } from '../inputs/verify-payment.input';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import { CurrentUser } from '@common/presentation/decorators/index';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { CustomerProfileService } from '@modules/customers/application/services/customer-profile.service';

@Resolver(() => PaymentType)
@UseGuards(GqlAuthGuard)
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly customerProfileService: CustomerProfileService,
  ) {}

  @Query(() => PaymentType, { nullable: true })
  async getPaymentByOrderId(
    @Args('orderId') orderId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<PaymentType | null> {
    return this.paymentService.getPaymentByOrderId(orderId, user.sub);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => PaymentType)
  async createPayment(
    @Args('input') input: CreatePaymentInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<PaymentType> {
    const profile = await this.customerProfileService.findByUserId(user.sub);
    if (!profile || profile.id !== input.customerProfileId) {
      throw new ForbiddenException(
        'You are not authorized to create a payment for this customer profile',
      );
    }
    return this.paymentService.createPayment(
      input.customerProfileId,
      input.amount,
    );
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => PaymentType)
  async verifyPaymentSuccess(
    @Args('input') input: VerifyPaymentInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<PaymentType> {
    return this.paymentService.verifyPaymentSuccess(
      input.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature,
      user.sub,
    );
  }
}
