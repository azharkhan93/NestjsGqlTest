import { Module } from '@nestjs/common';
import { RolesService } from './application/services/roles.service';
import { RolesResolver } from './presentation/graphql/resolvers/roles.resolver';
import { IRoleRepository } from './domain/repositories/role.repository.interface';
import { RoleRepository } from './infrastructure/persistence/repositories/role.repository';

@Module({
  providers: [
    RolesService,
    RolesResolver,
    {
      provide: IRoleRepository,
      useClass: RoleRepository,
    },
  ],
  exports: [RolesService, IRoleRepository],
})
export class RolesModule {}
