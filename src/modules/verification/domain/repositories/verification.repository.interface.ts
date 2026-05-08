import { VerificationEntity } from '../entities/verification.entity';

export abstract class IVerificationRepository {
  abstract save(data: { phoneNumber: string; code: string; expiresAt: Date }): Promise<void>;
  abstract findByPhoneAndCode(phoneNumber: string, code: string): Promise<VerificationEntity | null>;
  abstract markAsUsed(id: string): Promise<void>;
  abstract deleteExpired(): Promise<void>;
}
