import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { VendorProfileService } from '@modules/vendors/application/services';
import { VendorProfileType } from '@modules/vendors/presentation/graphql/types';
import {
  CreateVendorProfileInput,
  UpdateVendorProfileInput,
} from '@modules/vendors/presentation/graphql/inputs';

@Resolver(() => VendorProfileType)
export class VendorProfileResolver {
  constructor(private readonly service: VendorProfileService) {}

  @Query(() => VendorProfileType)
  async getVendorProfile(@Args('userId') userId: string) {
    return this.service.findByUserId(userId);
  }

  @Query(() => [VendorProfileType])
  async getVendorProfiles() {
    return this.service.findAll();
  }

  @Query(() => VendorProfileType)
  async getVendorProfileById(@Args('id', { type: () => ID }) id: string) {
    return this.service.findById(id);
  }

  @Mutation(() => VendorProfileType)
  async createVendorProfile(@Args('input') input: CreateVendorProfileInput) {
    return this.service.create(input);
  }

  @Mutation(() => VendorProfileType)
  async updateVendorProfile(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateVendorProfileInput,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteVendorProfile(@Args('id', { type: () => ID }) id: string) {
    return this.service.delete(id);
  }
}
