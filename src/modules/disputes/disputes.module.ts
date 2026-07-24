import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { DisputesService } from './application/services/disputes.service';
import { DisputesResolver } from './presentation/graphql/resolvers/disputes.resolver';

@Module({
  imports: [CommonModule],
  providers: [DisputesService, DisputesResolver],
  exports: [DisputesService],
})
export class DisputesModule {}
