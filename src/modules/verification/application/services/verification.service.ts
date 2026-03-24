import { Injectable } from '@nestjs/common';
import { IVerificationService } from '../../domain/services/verification-service.interface';
import { PhoneNumber } from '../../domain/value-objects/phone-number.vo';

@Injectable()
export class VerificationService {
  constructor(private readonly verificationProvider: IVerificationService) { }

  async requestOtp(rawPhone: string) {
    const phoneNumber = PhoneNumber.create(rawPhone);
    return this.verificationProvider.start(phoneNumber);
  }

  async verifyOtp(rawPhone: string, code: string) {
    const phoneNumber = PhoneNumber.create(rawPhone);
    return this.verificationProvider.check(phoneNumber, code);
  }
}
