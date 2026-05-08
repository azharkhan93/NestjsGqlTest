import { Injectable } from '@nestjs/common';
import { PrismaRepository, PrismaService } from '@common/infrastructure/persistence';
import { IVerificationRepository } from '@modules/verification/domain/repositories/verification.repository.interface';
import { VerificationEntity } from '@modules/verification/domain/entities/verification.entity';
import { Verification as PrismaVerification } from '@prisma/client';

@Injectable()
export class PrismaVerificationRepository
  extends PrismaRepository<VerificationEntity, PrismaVerification>
  implements IVerificationRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'verification');
  }

  async save(data: { phoneNumber: string; code: string; expiresAt: Date }): Promise<void> {
    await this.model.create({ data });
  }

  async findByPhoneAndCode(phoneNumber: string, code: string): Promise<VerificationEntity | null> {
    const record = await this.model.findFirst({
      where: {
        phoneNumber,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
        deletedAt: null,
      },
    });
    return record ? this.toEntity(record) : null;
  }

  async markAsUsed(id: string): Promise<void> {
    await this.model.update({ where: { id }, data: { isUsed: true } });
  }

  async deleteExpired(): Promise<void> {
    await this.model.updateMany({
      where: { expiresAt: { lt: new Date() }, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  toEntity(model: PrismaVerification): VerificationEntity {
    return new VerificationEntity({
      ...model,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: VerificationEntity): Record<string, unknown> {
    return {
      phoneNumber: entity.phoneNumber,
      code: entity.code,
      expiresAt: entity.expiresAt,
      isUsed: entity.isUsed,
    };
  }
}
