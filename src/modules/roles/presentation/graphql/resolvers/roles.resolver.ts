import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '@common/presentation/guards';
import { Roles } from '@common/presentation/decorators';
import { RolesService } from '@modules/roles/application/services/roles.service';
import { RoleType } from '../types/role.type';
import { UserRole } from '@common/domain/enums';

@Resolver(() => RoleType)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [RoleType])
  async roles(): Promise<RoleType[]> {
    return this.rolesService.findAll();
  }

  @Query(() => RoleType)
  async roleById(@Args('id') id: string): Promise<RoleType> {
    return this.rolesService.findById(id);
  }

  @Mutation(() => RoleType)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async createRole(
    @Args('name', { type: () => UserRole }) name: UserRole,
  ): Promise<RoleType> {
    return this.rolesService.create(name);
  }
}
