import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';
import { RoleEntity } from '@modules/roles/domain/entities/role.entity';

@Injectable({ scope: Scope.REQUEST })
export class RoleDataLoader {
  private readonly loader: DataLoader<string, RoleEntity | null>;

  constructor(private readonly roleRepository: IRoleRepository) {
    this.loader = new DataLoader<string, RoleEntity | null>(
      async (roleIds: readonly string[]) => {
        const roles = await this.roleRepository.findByIds([...roleIds]);
        const roleMap = new Map<string, RoleEntity>(
          roles.map((r) => [r.id, r]),
        );
        return roleIds.map((id) => roleMap.get(id) ?? null);
      },
    );
  }

  async load(roleId: string): Promise<RoleEntity | null> {
    return this.loader.load(roleId);
  }

  async loadMany(roleIds: string[]): Promise<(RoleEntity | null | Error)[]> {
    return this.loader.loadMany(roleIds);
  }
}
