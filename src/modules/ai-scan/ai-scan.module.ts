import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { AiScanService } from './application/services/ai-scan.service';
import { AiScanResolver } from './presentation/graphql/resolvers/ai-scan.resolver';
import { IAiScanGateway } from './domain/ports/ai-scan-gateway.interface';
import { GeminiGateway } from './infrastructure/gateways/gemini.gateway';

@Module({
  imports: [CommonModule],
  providers: [
    AiScanService,
    AiScanResolver,
    {
      provide: IAiScanGateway,
      useClass: GeminiGateway,
    },
  ],
  exports: [AiScanService, IAiScanGateway],
})
export class AiScanModule {}
