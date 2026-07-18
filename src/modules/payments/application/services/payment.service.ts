import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { IPaymentGateway } from '../../domain/ports/payment-gateway.interface';
import {
  PaymentEntity,
  PaymentStatus,
} from '../../domain/entities/payment.entity';
import { CustomerProfileService } from '@modules/customers/application/services/customer-profile.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentGateway: IPaymentGateway,
    private readonly customerProfileService: CustomerProfileService,
  ) {}

  async createPayment(
    customerProfileId: string,
    amount: number,
  ): Promise<PaymentEntity> {
    // 1. Verify customer profile exists
    await this.customerProfileService.findById(customerProfileId);

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    // 2. Call Razorpay gateway to create order
    const order = await this.paymentGateway.createOrder(amount);

    // 3. Create pending Payment record in DB
    const payment = PaymentEntity.create({
      customerProfileId,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.create(payment);
  }

  async getPaymentByOrderId(
    orderId: string,
    userId: string,
  ): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException(`Payment order with ID ${orderId} not found`);
    }

    // Ensure database reads are scoped to the authenticated user's profile
    const profile = await this.customerProfileService.findByUserId(userId);
    if (!profile || payment.customerProfileId !== profile.id) {
      throw new ForbiddenException(
        'You are not authorized to access this payment record',
      );
    }

    return payment;
  }

  async verifyPaymentSuccess(
    orderId: string,
    paymentId: string,
    signature: string,
    userId: string,
  ): Promise<PaymentEntity> {
    // 1. Find existing pending payment
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new BadRequestException(
        `Payment order with ID ${orderId} not found`,
      );
    }

    // 2. Verify signature request belongs to the payment session owner
    const profile = await this.customerProfileService.findByUserId(userId);
    if (!profile || payment.customerProfileId !== profile.id) {
      throw new ForbiddenException(
        'You are not authorized to verify this payment',
      );
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      return payment;
    }

    // 3. Verify signature using gateway
    const isValid = this.paymentGateway.verifySignature(
      orderId,
      paymentId,
      signature,
    );
    if (!isValid) {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
      });
      throw new BadRequestException(
        'Invalid payment signature verification failed',
      );
    }

    // 4. Update payment status to SUCCESS and save signature details
    const updated = await this.paymentRepository.update(payment.id, {
      status: PaymentStatus.SUCCESS,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    });

    if (!updated) {
      throw new BadRequestException('Failed to update payment status');
    }

    return updated;
  }
}
