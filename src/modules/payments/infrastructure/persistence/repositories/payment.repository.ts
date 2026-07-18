import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import {
  PaymentEntity,
  PaymentStatus,
} from '../../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { Payment as PrismaPayment } from '@prisma/client';

@Injectable()
export class PaymentRepository
  extends PrismaRepository<PaymentEntity, PrismaPayment>
  implements IPaymentRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'payment');
  }

  async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    const result = await this.model.findUnique({
      where: { razorpayOrderId: orderId },
    });
    return result ? this.toEntity(result) : null;
  }

  toEntity(model: PrismaPayment): PaymentEntity {
    return new PaymentEntity({
      id: model.id,
      customerProfileId: model.customerProfileId,
      razorpayOrderId: model.razorpayOrderId,
      razorpayPaymentId: model.razorpayPaymentId ?? undefined,
      razorpaySignature: model.razorpaySignature ?? undefined,
      amount: model.amount,
      currency: model.currency,
      status: model.status as unknown as PaymentStatus,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: PaymentEntity): Record<string, unknown> {
    return {
      customerProfileId: entity.customerProfileId,
      razorpayOrderId: entity.razorpayOrderId,
      razorpayPaymentId: entity.razorpayPaymentId,
      razorpaySignature: entity.razorpaySignature,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      deletedAt: entity.deletedAt,
    };
  }
}
