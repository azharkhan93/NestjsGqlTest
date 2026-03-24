import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/persistence/prisma/prisma.service';
import { IVerificationRepository } from '../../../domain/repositories/verification.repository.interface';
import { VerificationEntity } from '../../../domain/entities/verification.entity';

@Injectable()
export class PrismaVerificationRepository implements IVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: { phoneNumber: string; code: string; expiresAt: Date }): Promise<void> {
    await this.prisma.verification.create({
      data: {
        phoneNumber: data.phoneNumber,
        code: data.code,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findOne(phoneNumber: string, code: string): Promise<VerificationEntity | null> {
    const record = await this.prisma.verification.findFirst({
      where: {
        phoneNumber,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
        deletedAt: null,
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      phoneNumber: record.phoneNumber,
      code: record.code,
      expiresAt: record.expiresAt,
      isUsed: record.isUsed,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    };
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.verification.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.verification.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
