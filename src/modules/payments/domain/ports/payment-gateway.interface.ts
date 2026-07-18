export abstract class IPaymentGateway {
  abstract createOrder(
    amount: number,
    currency?: string,
  ): Promise<{
    id: string;
    amount: number;
    currency: string;
  }>;

  abstract verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean;
}
