import { Injectable, Scope } from '@nestjs/common';
import { BaseDataLoader } from '../base.dataloader';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { UserEntity } from '@modules/users/domain/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserDataLoader extends BaseDataLoader<UserEntity> {
  constructor(userRepository: IUserRepository) {
    super(userRepository);
  }
}
