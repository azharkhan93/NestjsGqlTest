import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPaymentGateway } from '../../domain/ports/payment-gateway.interface';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayGateway implements IPaymentGateway {
  private readonly logger = new Logger(RazorpayGateway.name);
  private readonly keyId: string;
  private readonly keySecret: string;

  constructor(private readonly configService: ConfigService) {
    this.keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || '';
    this.keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';

    if (!this.keyId || !this.keySecret) {
      this.logger.error(
        'Razorpay credentials missing in environment variables',
      );
    }
  }

  async createOrder(
    amount: number,
    currency = 'INR',
  ): Promise<{
    id: string;
    amount: number;
    currency: string;
  }> {
    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString(
      'base64',
    );

    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // convert to paise
          currency,
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Razorpay order creation failed: ${errorText}`);
        throw new Error(
          `Razorpay order creation failed: ${response.statusText}`,
        );
      }

      const data = (await response.json()) as {
        id: string;
        amount: number;
        currency: string;
      };

      return {
        id: data.id,
        amount: data.amount / 100, // convert back to standard currency units
        currency: data.currency,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error creating Razorpay order: ${msg}`);
      throw new Error(`Failed to initialize payment: ${msg}`);
    }
  }

  verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    try {
      const text = `${orderId}|${paymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(text)
        .digest('hex');
      return generatedSignature === signature;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error verifying signature: ${msg}`);
      return false;
    }
  }
}
