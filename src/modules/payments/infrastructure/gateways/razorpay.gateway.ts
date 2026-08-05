import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadGatewayException,
} from '@nestjs/common';
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
      throw new Error(
        'Critical Configuration Error: Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are missing in environment variables.',
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
    const receipt = `rcpt_${crypto.randomUUID()}`;
    const idempotencyKey = `idemp_${crypto.randomUUID()}`;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
            'X-Idempotency-Key': idempotencyKey,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency,
            receipt,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.warn(
            `Razorpay API attempt ${attempts} failed: Status ${response.status}. Error: ${errorText}`,
          );

          // Retry on transient 5xx server errors, otherwise throw immediately
          if (response.status >= 500 && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
            continue;
          }

          throw new BadGatewayException(
            `Razorpay order creation failed with status ${response.status}: ${response.statusText}`,
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
        if (attempts >= maxAttempts) {
          const msg = error instanceof Error ? error.message : String(error);
          this.logger.error(
            `Error creating Razorpay order after ${attempts} attempts: ${msg}`,
          );
          throw new InternalServerErrorException(
            `Failed to initialize payment after retries: ${msg}`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
      }
    }

    throw new InternalServerErrorException(
      'Failed to initialize payment: Max attempts exceeded',
    );
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

      const generatedBuffer = Buffer.from(generatedSignature, 'hex');
      const signatureBuffer = Buffer.from(signature, 'hex');

      if (generatedBuffer.length !== signatureBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(generatedBuffer, signatureBuffer);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error verifying signature: ${msg}`);
      return false;
    }
  }
}
