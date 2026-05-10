import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from '@modules/users/application/services/user.service';
import { RolesService } from '@modules/roles/application/services/roles.service';
import { UserType } from '../types/user.type';
import { RoleType } from '@modules/roles/presentation/graphql/types/role.type';
import { UserRole } from '@common/domain/enums';
import { AuthPayloadType } from '../types/auth-payload.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly service: UserService,
    private readonly rolesService: RolesService,
  ) {}

  @ResolveField(() => RoleType, { nullable: true })
  async role(@Parent() user: UserType) {
    if (!user.roleId) return null;
    return this.rolesService.findById(user.roleId);
  }

  @Query(() => [UserType])
  async users() {
    return this.service.findAll();
  }

  @Query(() => UserType)
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.service.findById(id);
  }

  @Mutation(() => AuthPayloadType)
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
