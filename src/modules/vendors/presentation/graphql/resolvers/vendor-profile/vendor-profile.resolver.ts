import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VendorProfileService } from '@modules/vendors/application/services';
import { VendorProfileType } from '@modules/vendors/presentation/graphql/types';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import { CurrentUser } from '@common/presentation/decorators/index';
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
  @UseGuards(GqlAuthGuard)
  async createVendorProfile(
    @Args('input') input: CreateVendorProfileInput,
    @CurrentUser() user: any,
  ) {
    input.userId = input.userId || user?.sub || user?.id;
    return this.service.createOrUpdate(input);
  }

  @Mutation(() => VendorProfileType)
  @UseGuards(GqlAuthGuard)
  async updateVendorProfile(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateVendorProfileInput,
  ) {
    return this.service.update(id, input);
  }

  @Query(() => [VendorProfileType])
  async searchVendors(@Args('query') query: string) {
    return this.service.search(query);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteVendorProfile(@Args('id', { type: () => ID }) id: string) {
    return this.service.delete(id);
  }
}
