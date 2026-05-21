import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerProfileService } from '../../../application/services/customer-profile.service';
import { CustomerProfileType } from '../types/customer-profile.type';
import { UpsertCustomerProfileInput } from '../inputs/upsert-customer-profile.input';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import { CurrentUser } from '@common/presentation/decorators/index';

@Resolver(() => CustomerProfileType)
@UseGuards(GqlAuthGuard)
export class CustomerProfileResolver {
  constructor(private readonly service: CustomerProfileService) {}

  @Query(() => CustomerProfileType, { nullable: true })
  async getCustomerProfile(
    @Args('userId') userId: string,
  ): Promise<CustomerProfileType | null> {
    return this.service.findByUserId(userId) as any;
  }

  @Mutation(() => CustomerProfileType)
  async upsertCustomerProfile(
    @Args('input') input: UpsertCustomerProfileInput,
    @CurrentUser() user: any,
  ): Promise<CustomerProfileType> {
    const userId = user.sub;
    return this.service.upsert(userId, input) as any;
  }

  @Mutation(() => Boolean)
  async deleteCustomerProfile(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.delete(id);
  }
}
