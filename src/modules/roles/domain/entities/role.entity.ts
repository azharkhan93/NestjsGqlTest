import { BaseEntity } from '@common/domain/entities';
import { UserRole } from '@common/domain/enums';

export { UserRole };

export class RoleEntity extends BaseEntity {
  name: UserRole;
  deletedAt?: Date | null;

  constructor(partial: Partial<RoleEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<RoleEntity>): RoleEntity {
    return new RoleEntity(data);
  }
}
