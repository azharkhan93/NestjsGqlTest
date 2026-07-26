import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { DisputeEntity } from '../../domain/entities/dispute.entity';
import { Dispute as PrismaDispute } from '@prisma/client';
import { IDisputeRepository } from '../../domain/repositories/dispute.repository.interface';

@Injectable()
export class PrismaDisputeRepository
  extends PrismaRepository<DisputeEntity, PrismaDispute>
  implements IDisputeRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'dispute');
  }

  async findByBookingId(bookingId: string): Promise<DisputeEntity | null> {
    const result = await this.model.findUnique({
      where: { bookingId },
    });
    return result ? this.toEntity(result) : null;
  }

  toEntity(model: PrismaDispute): DisputeEntity {
    return new DisputeEntity({
      id: model.id,
      bookingId: model.bookingId,
      reason: model.reason,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: DisputeEntity): Record<string, unknown> {
    return {
      bookingId: entity.bookingId,
      reason: entity.reason,
      status: entity.status,
    };
  }
}
