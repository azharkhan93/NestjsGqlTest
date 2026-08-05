import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VendorProfileService } from '@modules/vendors/application/services';
import { VendorProfileType } from '@modules/vendors/presentation/graphql/types';
import { GqlAuthGuard } from '@common/presentation/guards';
import { CurrentUser } from '@common/presentation/decorators';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { assertOwnerOrAdmin } from '@common/application/helpers';
import {
  CreateVendorProfileInput,
  UpdateVendorProfileInput,
} from '@modules/vendors/presentation/graphql/inputs';
import { UserType } from '@modules/users/presentation/graphql/types/user.type';
import { UserDataLoader } from '@common/infrastructure/dataloaders/user';
import { VendorProfileEntity } from '@modules/vendors/domain/entities';

@Resolver(() => VendorProfileType)
export class VendorProfileResolver {
  constructor(
    private readonly service: VendorProfileService,
    private readonly userDataLoader: UserDataLoader,
  ) {}

  @ResolveField(() => UserType, { nullable: true })
  async user(@Parent() vendor: VendorProfileEntity) {
    if (!vendor.userId) return null;
    return this.userDataLoader.load(vendor.userId);
  }

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
    @CurrentUser() user: CurrentUserPayload,
  ) {
    input.userId = user.sub;
    return this.service.createOrUpdate(input);
  }

  @Mutation(() => VendorProfileType)
  @UseGuards(GqlAuthGuard)
  async updateVendorProfile(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateVendorProfileInput,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const existing = await this.service.findById(id);
    assertOwnerOrAdmin(existing?.userId, user, 'update this vendor profile');
    return this.service.update(id, input);
  }

  @Query(() => [VendorProfileType])
  async searchVendors(@Args('query') query: string) {
    return this.service.search(query);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteVendorProfile(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const existing = await this.service.findById(id);
    assertOwnerOrAdmin(existing?.userId, user, 'delete this vendor profile');
    return this.service.delete(id);
  }
}
