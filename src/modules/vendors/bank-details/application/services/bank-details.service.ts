import { Injectable } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { IBankDetailsRepository } from '@modules/vendors/bank-details/domain/repositories';
import { BankDetailsEntity } from '@modules/vendors/bank-details/domain/entities';
import { UpsertBankDetailsInput } from '@modules/vendors/bank-details/presentation/graphql/inputs';

@Injectable()
export class BankDetailsService {
  constructor(private readonly repository: IBankDetailsRepository) {}

  async upsert(
    vendorProfileId: string,
    input: UpsertBankDetailsInput,
  ): Promise<BankDetailsEntity> {
    return this.repository.upsert(vendorProfileId, input);
  }

  async findByVendorProfileId(
    vendorProfileId: string,
  ): Promise<BankDetailsEntity> {
    return assertFound(
      await this.repository.findByVendorProfileId(vendorProfileId),
      `Bank details for vendor ${vendorProfileId}`,
    );
  }

  async delete(id: string): Promise<boolean> {
    assertFound(await this.repository.remove(id), `Bank details ${id}`);
    return true;
  }
}
