import { Injectable, Scope } from '@nestjs/common';
import { BaseDataLoader } from '../base.dataloader';
import { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';
import { RoleEntity } from '@modules/roles/domain/entities/role.entity';

@Injectable({ scope: Scope.REQUEST })
export class RoleDataLoader extends BaseDataLoader<RoleEntity> {
  constructor(roleRepository: IRoleRepository) {
    super(roleRepository);
  }
}
