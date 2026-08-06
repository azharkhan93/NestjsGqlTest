import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GqlAuthGuard } from '@common/presentation/guards';
import { AiScanService } from '../../../application/services/ai-scan.service';
import { VehicleScanResultType } from '../types/vehicle-scan-result.type';

@Resolver()
@UseGuards(GqlAuthGuard)
export class AiScanResolver {
  constructor(private readonly aiScanService: AiScanService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => VehicleScanResultType, { name: 'scanVehicleCondition' })
  async scanVehicleCondition(
    @Args('base64Images', { type: () => [String] }) base64Images: string[],
  ): Promise<VehicleScanResultType> {
    if (!base64Images || base64Images.length === 0) {
      throw new BadRequestException('At least one vehicle image is required');
    }

    const imageBuffers: Buffer[] = base64Images.map((base64: string) => {
      const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
      return Buffer.from(cleanBase64, 'base64');
    });

    const result =
      await this.aiScanService.analyzeVehicleCondition(imageBuffers);

    return {
      isVehicleDetected: result.isVehicleDetected,
      overallConditionScore: result.overallConditionScore,
      retakeGuidance: result.retakeGuidance,
      detectedConditions: result.detectedConditions.map((c) => ({
        id: c.id,
        category: c.category,
        name: c.name,
        severity: c.severity,
        confidenceScore: c.confidenceScore,
        summary: c.summary,
      })),
      recommendedPackage: {
        packageId: result.recommendedPackage.packageId,
        title: result.recommendedPackage.title,
        reason: result.recommendedPackage.reason,
        suggestedAddons: [...result.recommendedPackage.suggestedAddons],
      },
    };
  }
}
