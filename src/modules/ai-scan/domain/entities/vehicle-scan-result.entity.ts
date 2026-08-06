import { ConditionCategory } from '../enums/condition-category.enum';
import { ConditionSeverity } from '../enums/condition-severity.enum';

export interface DetectedConditionEntity {
  readonly id: string;
  readonly category: ConditionCategory;
  readonly name: string;
  readonly severity: ConditionSeverity;
  readonly confidenceScore: number;
  readonly summary: string;
}

export interface RecommendedPackageEntity {
  readonly packageId: string;
  readonly title: string;
  readonly reason: string;
  readonly originalPrice?: number;
  readonly discountedPrice?: number;
  readonly suggestedAddons: readonly string[];
}

export class VehicleScanResultEntity {
  readonly isVehicleDetected: boolean;
  readonly vehicleType?: string;
  readonly estimatedColor?: string;
  readonly overallConditionScore: number;
  readonly detectedConditions: readonly DetectedConditionEntity[];
  readonly recommendedPackage: RecommendedPackageEntity;
  readonly retakeGuidance?: string;

  constructor(partial: Partial<VehicleScanResultEntity>) {
    this.isVehicleDetected = partial.isVehicleDetected ?? false;
    this.vehicleType = partial.vehicleType;
    this.estimatedColor = partial.estimatedColor;
    this.overallConditionScore = partial.overallConditionScore ?? 5;
    this.detectedConditions = partial.detectedConditions ?? [];
    this.recommendedPackage = partial.recommendedPackage ?? {
      packageId: 'basic_wash',
      title: 'Standard Exterior Wash',
      reason: 'Regular maintenance cleaning recommended.',
      suggestedAddons: [],
    };
    this.retakeGuidance = partial.retakeGuidance;
  }
}
