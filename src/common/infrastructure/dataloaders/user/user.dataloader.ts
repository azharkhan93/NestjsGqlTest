import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { UserEntity } from '@modules/users/domain/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserDataLoader {
  private readonly loader: DataLoader<string, UserEntity | null>;

  constructor(private readonly userRepository: IUserRepository) {
    this.loader = new DataLoader<string, UserEntity | null>(
      async (userIds: readonly string[]) => {
        const users = await Promise.all(
          userIds.map((id) => this.userRepository.findOne(id)),
        );
        const userMap = new Map<string, UserEntity>();
        users.forEach((u) => {
          if (u) userMap.set(u.id, u);
        });
        return userIds.map((id) => userMap.get(id) ?? null);
      },
    );
  }

  async load(userId: string): Promise<UserEntity | null> {
    return this.loader.load(userId);
  }
}
