import { BaseEntity } from '@common/domain/entities';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class PaymentEntity extends BaseEntity {
  customerProfileId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  deletedAt?: Date;

  constructor(partial: Partial<PaymentEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<PaymentEntity>): PaymentEntity {
    if (!data.customerProfileId) {
      throw new Error('customerProfileId is required');
    }
    if (data.amount === undefined || data.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    if (!data.razorpayOrderId) {
      throw new Error('razorpayOrderId is required');
    }
    return new PaymentEntity({
      ...data,
      currency: data.currency || 'INR',
      status: data.status || PaymentStatus.PENDING,
    });
  }
}
