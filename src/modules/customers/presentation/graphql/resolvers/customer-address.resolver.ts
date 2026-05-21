import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerAddressService } from '../../../application/services/customer-address.service';
import { CustomerAddressType } from '../types/customer-address.type';
import { UpsertCustomerAddressInput } from '../inputs/upsert-customer-address.input';
import { GqlAuthGuard } from '@common/presentation/guards/index';

@Resolver(() => CustomerAddressType)
@UseGuards(GqlAuthGuard)
export class CustomerAddressResolver {
  constructor(private readonly service: CustomerAddressService) {}

  @Query(() => [CustomerAddressType])
  async getCustomerAddresses(
    @Args('customerProfileId', { type: () => ID }) customerProfileId: string,
  ): Promise<CustomerAddressType[]> {
    return this.service.findByCustomerProfileId(customerProfileId) as any;
  }

  @Mutation(() => CustomerAddressType)
  async createCustomerAddress(
    @Args('customerProfileId', { type: () => ID }) customerProfileId: string,
    @Args('input') input: UpsertCustomerAddressInput,
  ): Promise<CustomerAddressType> {
    return this.service.create(customerProfileId, input) as any;
  }

  @Mutation(() => CustomerAddressType)
  async updateCustomerAddress(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpsertCustomerAddressInput,
  ): Promise<CustomerAddressType> {
    return this.service.update(id, input) as any;
  }

  @Mutation(() => Boolean)
  async deleteCustomerAddress(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.delete(id);
  }
}
