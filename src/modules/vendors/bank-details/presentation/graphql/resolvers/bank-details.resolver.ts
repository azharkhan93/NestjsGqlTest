import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@common/presentation/guards';
import { CurrentUser } from '@common/presentation/decorators';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { BankDetailsService } from '@modules/vendors/bank-details/application/services';
import { VendorProfileService } from '@modules/vendors/application/services';
import { BankDetailsType } from '../types';
import { UpsertBankDetailsInput } from '../inputs';

@Resolver(() => BankDetailsType)
@UseGuards(GqlAuthGuard)
export class BankDetailsResolver {
  constructor(
    private readonly service: BankDetailsService,
    private readonly vendorProfileService: VendorProfileService,
  ) {}

  @Query(() => BankDetailsType, { nullable: true })
  async getVendorBankDetails(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<BankDetailsType | null> {
    await this.vendorProfileService.assertOwnership(
      vendorProfileId,
      user,
      'manage bank details for this vendor profile',
    );
    return this.service.findByVendorProfileId(vendorProfileId);
  }

  @Mutation(() => BankDetailsType)
  async upsertVendorBankDetails(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: UpsertBankDetailsInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<BankDetailsType> {
    await this.vendorProfileService.assertOwnership(
      vendorProfileId,
      user,
      'manage bank details for this vendor profile',
    );
    return this.service.upsert(vendorProfileId, input);
  }

  @Mutation(() => Boolean)
  async deleteVendorBankDetails(
    @Args('id', { type: () => ID }) id: string,
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<boolean> {
    await this.vendorProfileService.assertOwnership(
      vendorProfileId,
      user,
      'manage bank details for this vendor profile',
    );
    return this.service.delete(id);
  }
}

