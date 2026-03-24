import { BaseEntity } from '@common/domain/entities';

export class VerificationEntity extends BaseEntity {
  phoneNumber: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  deletedAt?: Date | null;
}
