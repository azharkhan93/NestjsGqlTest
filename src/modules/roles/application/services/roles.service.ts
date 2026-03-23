import { Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';
import { RoleEntity, UserRole } from '@modules/roles/domain/entities/role.entity';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.findAll();
  }

  async findById(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: UserRole): Promise<RoleEntity> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async create(name: UserRole): Promise<RoleEntity> {
    const existing = await this.roleRepository.findByName(name);
    if (existing) {
      return existing;
    }
    return this.roleRepository.create({ name });
  }
}
