import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { GqlAuthGuard } from '@common/presentation/guards';
import { CurrentUser } from '@common/presentation/decorators';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { UserRole } from '@common/domain/enums';
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

  private async assertVendorOwnership(
    vendorProfileId: string,
    user: CurrentUserPayload,
  ): Promise<void> {
    if (user.role === UserRole.SUPER_ADMIN) return;
    const vendorProfile =
      await this.vendorProfileService.findById(vendorProfileId);
    if (!vendorProfile || vendorProfile.userId !== user.sub) {
      throw new ForbiddenException(
        'You are not authorized to manage bank details for this vendor profile',
      );
    }
  }

  @Query(() => BankDetailsType, { nullable: true })
  async getVendorBankDetails(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<BankDetailsType | null> {
    await this.assertVendorOwnership(vendorProfileId, user);
    return this.service.findByVendorProfileId(vendorProfileId);
  }

  @Mutation(() => BankDetailsType)
  async upsertVendorBankDetails(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: UpsertBankDetailsInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<BankDetailsType> {
    await this.assertVendorOwnership(vendorProfileId, user);
    return this.service.upsert(vendorProfileId, input);
  }

  @Mutation(() => Boolean)
  async deleteVendorBankDetails(
    @Args('id', { type: () => ID }) id: string,
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<boolean> {
    await this.assertVendorOwnership(vendorProfileId, user);
    return this.service.delete(id);
  }
}
