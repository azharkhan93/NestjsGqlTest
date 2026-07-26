import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@common/presentation/guards';
import { BankDetailsService } from '@modules/vendors/bank-details/application/services';
import { BankDetailsType } from '../types';
import { UpsertBankDetailsInput } from '../inputs';

@Resolver(() => BankDetailsType)
@UseGuards(GqlAuthGuard)
export class BankDetailsResolver {
  constructor(private readonly service: BankDetailsService) {}

  @Query(() => BankDetailsType, { nullable: true })
  async getVendorBankDetails(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
  ): Promise<BankDetailsType | null> {
    return this.service.findByVendorProfileId(vendorProfileId);
  }

  @Mutation(() => BankDetailsType)
  async upsertVendorBankDetails(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: UpsertBankDetailsInput,
  ): Promise<BankDetailsType> {
    return this.service.upsert(vendorProfileId, input);
  }

  @Mutation(() => Boolean)
  async deleteVendorBankDetails(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.delete(id);
  }
}
