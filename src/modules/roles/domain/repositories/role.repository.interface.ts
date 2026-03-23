import { RoleEntity } from '../entities/role.entity';

export abstract class IRoleRepository {
  abstract findAll(): Promise<RoleEntity[]>;
  abstract findById(id: string): Promise<RoleEntity | null>;
  abstract findByName(name: string): Promise<RoleEntity | null>;
  abstract create(data: Partial<RoleEntity>): Promise<RoleEntity>;
}
