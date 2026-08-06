import { VehicleScanResultEntity } from '../entities/vehicle-scan-result.entity';

/**
 * Port interface for AI Vehicle Scan Gateway — decouples application service from Gemini LLM infrastructure.
 */
export abstract class IAiScanGateway {
  abstract analyze(
    imageBuffers: readonly Buffer[],
  ): Promise<VehicleScanResultEntity>;
}
