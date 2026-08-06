import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { CommonModule } from '@common/common.module';
import { TrackingService } from './application/services/tracking.service';
import { TrackingResolver } from './presentation/graphql/resolvers/tracking.resolver';

@Module({
  imports: [CommonModule],
  providers: [
    TrackingService,
    TrackingResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [TrackingService],
})
export class TrackingModule {}
