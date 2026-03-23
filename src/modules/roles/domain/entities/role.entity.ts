import { BaseEntity } from '@common/domain/entities';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
}

export class RoleEntity extends BaseEntity {
  name: UserRole;
  deletedAt?: Date | null;
}
