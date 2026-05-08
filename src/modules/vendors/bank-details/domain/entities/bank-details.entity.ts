import { BaseEntity } from '@common/domain/entities';

export class BankDetailsEntity extends BaseEntity {
  vendorProfileId: string;
  accountHolder: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  deletedAt?: Date;

  constructor(partial: Partial<BankDetailsEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<BankDetailsEntity>): BankDetailsEntity {
    return new BankDetailsEntity(data);
  }
}
