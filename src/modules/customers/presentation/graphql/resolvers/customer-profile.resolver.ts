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
import { CustomerProfileService } from '@modules/customers/application/services/customer-profile.service';
import { CustomerProfileType } from '@modules/customers/presentation/graphql/types/customer-profile.type';
import { UpsertCustomerProfileInput } from '@modules/customers/presentation/graphql/inputs/upsert-customer-profile.input';
import { GqlAuthGuard } from '@common/presentation/guards';
import { CurrentUser } from '@common/presentation/decorators';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { assertOwnerOrAdmin } from '@common/application/helpers';
import { CustomerProfileEntity } from '@modules/customers/domain/entities/customer-profile.entity';
import { UserType } from '@modules/users/presentation/graphql/types/user.type';
import { UserDataLoader } from '@common/infrastructure/dataloaders/user';

@Resolver(() => CustomerProfileType)
@UseGuards(GqlAuthGuard)
export class CustomerProfileResolver {
  constructor(
    private readonly service: CustomerProfileService,
    private readonly userDataLoader: UserDataLoader,
  ) {}

  @ResolveField(() => UserType, { nullable: true })
  async user(@Parent() profile: CustomerProfileEntity) {
    if (!profile.userId) return null;
    return this.userDataLoader.load(profile.userId);
  }

  @Query(() => CustomerProfileType, { nullable: true })
  async getCustomerProfile(
    @Args('userId') userId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CustomerProfileEntity | null> {
    assertOwnerOrAdmin(userId, user, 'view another customer profile');
    return this.service.findByUserId(userId);
  }

  @Mutation(() => CustomerProfileType)
  async upsertCustomerProfile(
    @Args('input') input: UpsertCustomerProfileInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CustomerProfileEntity> {
    const userId = user.sub;
    return this.service.upsert(userId, input);
  }

  @Mutation(() => Boolean)
  async deleteCustomerProfile(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<boolean> {
    const profile = await this.service.findById(id);
    assertOwnerOrAdmin(profile?.userId, user, 'delete this customer profile');
    return this.service.delete(id);
  }
}
