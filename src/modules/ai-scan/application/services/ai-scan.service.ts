import { Injectable } from '@nestjs/common';
import { IAiScanGateway } from '../../domain/ports/ai-scan-gateway.interface';
import { VehicleScanResultEntity } from '../../domain/entities/vehicle-scan-result.entity';

@Injectable()
export class AiScanService {
  constructor(private readonly aiScanGateway: IAiScanGateway) {}

  async analyzeVehicleCondition(
    imageBuffers: readonly Buffer[],
  ): Promise<VehicleScanResultEntity> {
    return this.aiScanGateway.analyze(imageBuffers);
  }
}
