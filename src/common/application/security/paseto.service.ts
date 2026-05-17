import { Injectable } from '@nestjs/common';
import { V3 } from 'paseto';
import * as crypto from 'crypto';

@Injectable()
export class PasetoService {
  private readonly key: Buffer;

  constructor() {
    const secret = process.env.PASETO_SECRET || 'xyzsecretkey';
    this.key = crypto.createHash('sha256').update(secret).digest();
  }

  async sign(payload: any): Promise<string> {
    return V3.encrypt(payload, this.key, {
      expiresIn: '4d',
      iat: true,
    });
  }

  async verify(token: string): Promise<any> {
    try {
      return await V3.decrypt(token, this.key);
    } catch {
      return null;
    }
  }
}
