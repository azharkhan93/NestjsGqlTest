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
    return new PaymentEntity(data);
  }
}
