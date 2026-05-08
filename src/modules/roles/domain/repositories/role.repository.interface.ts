import { IRepository } from '@common/domain/repositories';
import { RoleEntity } from '../entities/role.entity';
import { UserRole } from '@common/domain/enums';

export abstract class IRoleRepository extends IRepository<RoleEntity> {
  abstract findByName(name: UserRole): Promise<RoleEntity | null>;
}
