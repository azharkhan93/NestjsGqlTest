import { IRepository } from '@common/domain/repositories/repository.interface';
import { UserEntity } from '../entities/user.entity';

export abstract class IUserRepository extends IRepository<UserEntity> {
  abstract findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
