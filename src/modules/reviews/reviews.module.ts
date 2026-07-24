import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { ReviewsService } from './application/services/reviews.service';
import { ReviewsResolver } from './presentation/graphql/resolvers/reviews.resolver';

@Module({
  imports: [CommonModule],
  providers: [ReviewsService, ReviewsResolver],
  exports: [ReviewsService],
})
export class ReviewsModule {}
