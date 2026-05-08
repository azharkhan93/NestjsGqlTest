import { BaseEntity } from '@common/domain/entities';

export class VerificationEntity extends BaseEntity {
  phoneNumber: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  deletedAt?: Date | null;

  constructor(partial: Partial<VerificationEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<VerificationEntity>): VerificationEntity {
    return new VerificationEntity(data);
  }
}
