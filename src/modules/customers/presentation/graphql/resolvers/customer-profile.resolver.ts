import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerProfileService } from '../../../application/services/customer-profile.service';
import { CustomerProfileType } from '../types/customer-profile.type';
import { UpsertCustomerProfileInput } from '../inputs/upsert-customer-profile.input';
import { GqlAuthGuard } from '@common/presentation/guards/index';
import { CurrentUser } from '@common/presentation/decorators/index';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { CustomerProfileEntity } from '../../../domain/entities/customer-profile.entity';

@Resolver(() => CustomerProfileType)
@UseGuards(GqlAuthGuard)
export class CustomerProfileResolver {
  constructor(private readonly service: CustomerProfileService) {}

  @Query(() => CustomerProfileType, { nullable: true })
  async getCustomerProfile(
    @Args('userId') userId: string,
  ): Promise<CustomerProfileEntity | null> {
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
  ): Promise<boolean> {
    return this.service.delete(id);
  }
}
