import { Injectable } from '@nestjs/common';
import { PrismaRepository, PrismaService } from '@common/infrastructure/persistence';
import { RoleEntity, UserRole } from '@modules/roles/domain/entities/role.entity';
import { Role as PrismaRole, UserRole as PrismaUserRole } from '@prisma/client';
import { IRoleRepository } from '@modules/roles/domain/repositories/role.repository.interface';

@Injectable()
export class RoleRepository
  extends PrismaRepository<RoleEntity, PrismaRole>
  implements IRoleRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'role');
  }

  async findByName(name: UserRole): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({
      where: { name: this.toPrismaRole(name) },
    });
    return role ? this.toEntity(role) : null;
  }

  async findById(id: string): Promise<RoleEntity | null> {
    return this.findOne(id);
  }

  toEntity(model: PrismaRole): RoleEntity {
    const entity = new RoleEntity();
    entity.id = model.id;
    entity.name = this.toDomainRole(model.name);
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    entity.deletedAt = model.deletedAt;
    return entity;
  }

  toPrisma(entity: RoleEntity): Record<string, unknown> {
    return {
      id: entity.id,
      name: this.toPrismaRole(entity.name),
    };
  }

  private toDomainRole(role: PrismaUserRole): UserRole {
    const mapping: Record<PrismaUserRole, UserRole> = {
      [PrismaUserRole.CUSTOMER]: UserRole.CUSTOMER,
      [PrismaUserRole.PROVIDER]: UserRole.PROVIDER,
    };
    return mapping[role];
  }

  private toPrismaRole(role: UserRole): PrismaUserRole {
    const mapping: Record<UserRole, PrismaUserRole> = {
      [UserRole.CUSTOMER]: PrismaUserRole.CUSTOMER,
      [UserRole.PROVIDER]: PrismaUserRole.PROVIDER,
    };
    return mapping[role];
  }
}
