import { IRepository } from '@common/domain/repositories/repository.interface';
import { PaymentEntity } from '../entities/payment.entity';

export abstract class IPaymentRepository extends IRepository<PaymentEntity> {
  abstract findByOrderId(orderId: string): Promise<PaymentEntity | null>;
}
