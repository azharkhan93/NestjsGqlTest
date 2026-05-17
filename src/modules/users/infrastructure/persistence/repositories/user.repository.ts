import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { User as PrismaUser } from '@prisma/client';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';

@Injectable()
export class PrismaUserRepository
  extends PrismaRepository<UserEntity, PrismaUser>
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    const user = await this.model.findUnique({ where: { phoneNumber } });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.model.findUnique({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  toEntity(model: PrismaUser): UserEntity {
    return new UserEntity({
      ...model,
      phoneNumber: model.phoneNumber ?? undefined,
      name: model.name ?? undefined,
      avatarUrl: model.avatarUrl ?? undefined,
      avatarPublicId: model.avatarPublicId ?? undefined,
      email: model.email ?? undefined,
      password: model.password ?? undefined,
      roleId: model.roleId ?? undefined,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: UserEntity): Record<string, unknown> {
    return {
      phoneNumber: entity.phoneNumber,
      email: entity.email,
      password: entity.password,
      name: entity.name,
      avatarUrl: entity.avatarUrl,
      avatarPublicId: entity.avatarPublicId,
      roleId: entity.roleId,
    };
  }
}
