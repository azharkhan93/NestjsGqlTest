import { Injectable } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';
import { RoleEntity } from '@modules/roles/domain/entities/role.entity';
import { UserRole } from '@common/domain/enums';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: string): Promise<RoleEntity> {
    return assertFound(await this.roleRepository.findOne(id), `Role ${id}`);
  }

  async findByName(name: UserRole): Promise<RoleEntity> {
    return assertFound(
      await this.roleRepository.findByName(name),
      `Role ${name}`,
    );
  }

  async create(name: UserRole): Promise<RoleEntity> {
    const existing = await this.roleRepository.findByName(name);
    if (existing) return existing;
    return this.roleRepository.create(RoleEntity.create({ name }));
  }
}
