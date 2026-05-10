import { Injectable } from '@nestjs/common';
import { V3 } from 'paseto';
import * as crypto from 'crypto';

@Injectable()
export class PasetoService {
  private readonly key: Buffer;

  constructor() {
    const secret = process.env.PASETO_SECRET || 'fallback-secret-for-development-only-needs-to-be-secure';
    this.key = crypto.createHash('sha256').update(secret).digest();
  }

  async sign(payload: any): Promise<string> {
    return V3.encrypt(payload, this.key, {
      expiresIn: '60d',
      iat: true,
    });
  }

  async verify(token: string): Promise<any> {
    try {
      return await V3.decrypt(token, this.key);
    } catch (error) {
      return null;
    }
  }
}
