import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaService,
} from '@common/infrastructure/persistence';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { Review as PrismaReview } from '@prisma/client';
import { IReviewRepository } from '../../domain/repositories/review.repository.interface';

@Injectable()
export class PrismaReviewRepository
  extends PrismaRepository<ReviewEntity, PrismaReview>
  implements IReviewRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'review');
  }

  async findByBookingId(bookingId: string): Promise<ReviewEntity | null> {
    const result = await this.model.findUnique({
      where: { bookingId },
    });
    return result ? this.toEntity(result) : null;
  }

  async findByVendorProfileId(
    vendorProfileId: string,
  ): Promise<ReviewEntity[]> {
    const results = await this.model.findMany({
      where: {
        booking: {
          service: {
            vendorProfileId,
          },
        },
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
    return results.map((r) => this.toEntity(r));
  }

  toEntity(model: PrismaReview): ReviewEntity {
    return new ReviewEntity({
      id: model.id,
      bookingId: model.bookingId,
      rating: model.rating,
      comment: model.comment ?? undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt ?? undefined,
    });
  }

  toPrisma(entity: ReviewEntity): Record<string, unknown> {
    return {
      bookingId: entity.bookingId,
      rating: entity.rating,
      comment: entity.comment,
    };
  }
}
