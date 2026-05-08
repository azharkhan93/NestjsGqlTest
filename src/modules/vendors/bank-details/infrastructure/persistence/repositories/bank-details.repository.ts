import { Injectable } from '@nestjs/common';
import { PrismaRepository, PrismaService } from '@common/infrastructure/persistence';
import { BankDetailsEntity } from '@modules/vendors/bank-details/domain/entities';
import { IBankDetailsRepository } from '@modules/vendors/bank-details/domain/repositories';
import { VendorBankDetails as PrismaVendorBankDetails } from '@prisma/client';

@Injectable()
export class BankDetailsRepository
  extends PrismaRepository<BankDetailsEntity, PrismaVendorBankDetails>
  implements IBankDetailsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'vendorBankDetails');
  }

  async findByVendorProfileId(vendorProfileId: string): Promise<BankDetailsEntity | null> {
    const result = await this.model.findUnique({ where: { vendorProfileId } });
    return result ? this.toEntity(result) : null;
  }

  async upsert(vendorProfileId: string, data: Partial<BankDetailsEntity>): Promise<BankDetailsEntity> {
    const result = await this.model.upsert({
      where: { vendorProfileId },
      update: {
        accountHolder: data.accountHolder,
        bankName: data.bankName,
        ifscCode: data.ifscCode,
        accountNumber: data.accountNumber,
      },
      create: {
        vendorProfileId,
        accountHolder: data.accountHolder!,
        bankName: data.bankName!,
        ifscCode: data.ifscCode!,
        accountNumber: data.accountNumber!,
      },
    });
    return this.toEntity(result);
  }

  toEntity(model: PrismaVendorBankDetails): BankDetailsEntity {
    return new BankDetailsEntity({
      ...model,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: BankDetailsEntity): Record<string, unknown> {
    return {
      vendorProfileId: entity.vendorProfileId,
      accountHolder: entity.accountHolder,
      bankName: entity.bankName,
      ifscCode: entity.ifscCode,
      accountNumber: entity.accountNumber,
    };
  }
}
