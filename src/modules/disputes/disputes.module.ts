import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { DisputesService } from './application/services/disputes.service';
import { DisputesResolver } from './presentation/graphql/resolvers/disputes.resolver';
import { IDisputeRepository } from './domain/repositories/dispute.repository.interface';
import { PrismaDisputeRepository } from './infrastructure/persistence/prisma-dispute.repository';
import { DataLoadersModule } from '@common/infrastructure/dataloaders/dataloaders.module';

@Module({
  imports: [CommonModule, DataLoadersModule],
  providers: [
    DisputesService,
    DisputesResolver,
    {
      provide: IDisputeRepository,
      useClass: PrismaDisputeRepository,
    },
  ],
  exports: [DisputesService, IDisputeRepository],
})
export class DisputesModule {}
