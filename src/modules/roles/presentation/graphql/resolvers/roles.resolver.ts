import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
  async createRole(@Args('name', { type: () => UserRole }) name: UserRole): Promise<RoleType> {
    return this.rolesService.create(name);
  }
}
