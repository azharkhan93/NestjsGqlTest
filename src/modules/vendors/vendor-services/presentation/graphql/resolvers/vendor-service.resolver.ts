import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VendorServiceService } from '@modules/vendors/vendor-services/application/services';
import { VendorServiceType } from '@modules/vendors/vendor-services/presentation/graphql/types';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import {
  CreateVendorServiceInput,
  UpdateVendorServiceInput,
} from '@modules/vendors/vendor-services/presentation/graphql/inputs';
import { VendorProfileType } from '@modules/vendors/presentation/graphql/types/vendor-profile/vendor-profile.type';
import { VendorProfileDataLoader } from '@common/infrastructure/dataloaders/vendor-profile';
import { VendorServiceEntity } from '@modules/vendors/vendor-services/domain/entities';

@Resolver(() => VendorServiceType)
export class VendorServiceResolver {
  constructor(
    private readonly service: VendorServiceService,
    private readonly vendorProfileDataLoader: VendorProfileDataLoader,
  ) {}

  @ResolveField(() => VendorProfileType, { nullable: true })
  async vendorProfile(@Parent() vendorService: VendorServiceEntity) {
    if (!vendorService.vendorProfileId) return null;
    return this.vendorProfileDataLoader.load(vendorService.vendorProfileId);
  }

  @Query(() => [VendorServiceType])
  async getVendorServices(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
  ): Promise<VendorServiceType[]> {
    return this.service.findAllByVendor(vendorProfileId);
  }

  @Query(() => VendorServiceType)
  async getVendorService(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<VendorServiceType> {
    return this.service.findOne(id);
  }

  @Mutation(() => VendorServiceType)
  @UseGuards(GqlAuthGuard)
  async createVendorService(
    @Args('input') input: CreateVendorServiceInput,
  ): Promise<VendorServiceType> {
    return this.service.create(input);
  }

  @Mutation(() => VendorServiceType)
  @UseGuards(GqlAuthGuard)
  async updateVendorService(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateVendorServiceInput,
  ): Promise<VendorServiceType> {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteVendorService(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.delete(id);
  }
}
