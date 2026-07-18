import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { CustomersModule } from '@modules/customers/customers.module';
import { PaymentService } from './application/services/payment.service';
import { PaymentResolver } from './presentation/graphql/resolvers/payment.resolver';
import { IPaymentRepository } from './domain/repositories/payment.repository.interface';
import { IPaymentGateway } from './domain/ports/payment-gateway.interface';
import { PaymentRepository } from './infrastructure/persistence/repositories/payment.repository';
import { RazorpayGateway } from './infrastructure/gateways/razorpay.gateway';

@Module({
  imports: [CommonModule, CustomersModule],
  providers: [
    PaymentService,
    PaymentResolver,
    {
      provide: IPaymentRepository,
      useClass: PaymentRepository,
    },
    {
      provide: IPaymentGateway,
      useClass: RazorpayGateway,
    },
  ],
  exports: [PaymentService],
})
export class PaymentsModule {}
