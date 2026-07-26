import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { ReviewsService } from './application/services/reviews.service';
import { ReviewsResolver } from './presentation/graphql/resolvers/reviews.resolver';
import { IReviewRepository } from './domain/repositories/review.repository.interface';
import { PrismaReviewRepository } from './infrastructure/persistence/prisma-review.repository';

@Module({
  imports: [CommonModule],
  providers: [
    ReviewsService,
    ReviewsResolver,
    {
      provide: IReviewRepository,
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [ReviewsService, IReviewRepository],
})
export class ReviewsModule {}
