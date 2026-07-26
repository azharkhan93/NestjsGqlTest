import { Injectable } from '@nestjs/common';
import { V3 } from 'paseto';
import * as crypto from 'crypto';
import { CurrentUserPayload } from '@common/domain/interfaces';

@Injectable()
export class PasetoService {
  private readonly key: Buffer;

  constructor() {
    const secret = process.env.PASETO_SECRET;
    if (!secret) {
      throw new Error(
        'Critical Configuration Error: PASETO_SECRET environment variable is missing.',
      );
    }
    this.key = crypto.createHash('sha256').update(secret).digest();
  }

  async sign(payload: Record<string, unknown>): Promise<string> {
    return V3.encrypt(payload, this.key, {
      expiresIn: '4d',
      iat: true,
    });
  }

  async verify(token: string): Promise<CurrentUserPayload | null> {
    try {
      const payload = (await V3.decrypt(token, this.key)) as unknown;
      return payload as CurrentUserPayload;
    } catch {
      return null;
    }
  }
}
