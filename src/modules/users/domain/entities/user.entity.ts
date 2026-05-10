import { BaseEntity } from '../../../../common/domain/entities/base.entity';

export class UserEntity extends BaseEntity {
  phoneNumber?: string;
  email?: string;
  password?: string;
  name?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  roleId?: string;
  deletedAt?: Date;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<UserEntity>): UserEntity {
    return new UserEntity(data);
  }
}
