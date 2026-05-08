import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from '../../../application/services/user.service';
import { UserType } from '../types/user.type';
import { UserRole } from '@modules/roles/domain/entities/role.entity';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => [UserType])
  async users() {
    return this.service.findAll();
  }

  @Query(() => UserType)
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.service.findById(id);
  }

  @Mutation(() => UserType)
  async loginByPhone(
    @Args('phoneNumber') phoneNumber: string,
    @Args('code') code: string,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ) {
    return this.service.loginByPhone(phoneNumber, code, role);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => ID }) id: string) {
    return this.service.delete(id);
  }
}
