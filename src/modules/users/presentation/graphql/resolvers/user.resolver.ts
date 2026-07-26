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
import { GqlAuthGuard } from '@common/presentation/guards';
import { UserService } from '@modules/users/application/services/user.service';
import { UserType } from '../types/user.type';
import { RoleType } from '@modules/roles/presentation/graphql/types/role.type';
import { UserRole } from '@common/domain/enums';
import { AuthPayloadType } from '../types/auth-payload.type';
import { RoleDataLoader } from '@common/infrastructure/dataloaders/role';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly service: UserService,
    private readonly roleDataLoader: RoleDataLoader,
  ) {}

  @ResolveField(() => RoleType, { nullable: true })
  async role(@Parent() user: UserType) {
    if (!user.roleId) return null;
    return this.roleDataLoader.load(user.roleId);
  }

  @Query(() => [UserType])
  @UseGuards(GqlAuthGuard)
  async users() {
    return this.service.findAll();
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
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

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async updateUserAvatar(
    @Args('id', { type: () => ID }) id: string,
    @Args('avatarUrl') avatarUrl: string,
  ) {
    return this.service.update(id, { avatarUrl });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@Args('id', { type: () => ID }) id: string) {
    return this.service.delete(id);
  }

  @Mutation(() => Boolean)
  async logout() {
    return true;
  }
}
