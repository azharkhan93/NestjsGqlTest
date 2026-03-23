import { PhoneNumber } from '../value-objects/phone-number.vo';

export abstract class IVerificationService {
  abstract start(phoneNumber: PhoneNumber): Promise<{ success: boolean; sid?: string; message: string }>;
  abstract check(phoneNumber: PhoneNumber, code: string): Promise<{ success: boolean; message: string }>;
}
