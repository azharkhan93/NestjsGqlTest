import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VendorServiceService } from '@modules/vendors/vendor-services/application/services';
import { VendorServiceType } from '@modules/vendors/vendor-services/presentation/graphql/types';
import { CreateVendorServiceInput, UpdateVendorServiceInput } from '@modules/vendors/vendor-services/presentation/graphql/inputs';

@Resolver(() => VendorServiceType)
export class VendorServiceResolver {
  constructor(private readonly service: VendorServiceService) {}

  @Query(() => [VendorServiceType])
  async getVendorServices(@Args('vendorProfileId', { type: () => ID }) vendorProfileId: string): Promise<VendorServiceType[]> {
    return this.service.findAllByVendor(vendorProfileId);
  }

  @Query(() => VendorServiceType)
  async getVendorService(@Args('id', { type: () => ID }) id: string): Promise<VendorServiceType> {
    return this.service.findOne(id);
  }

  @Mutation(() => VendorServiceType)
  async createVendorService(@Args('input') input: CreateVendorServiceInput): Promise<VendorServiceType> {
    return this.service.create(input);
  }

  @Mutation(() => VendorServiceType)
  async updateVendorService(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateVendorServiceInput,
  ): Promise<VendorServiceType> {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteVendorService(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
