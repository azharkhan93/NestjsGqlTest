import {
  ObjectType,
  Field,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { ConditionCategory } from '../../../domain/enums/condition-category.enum';
import { ConditionSeverity } from '../../../domain/enums/condition-severity.enum';

registerEnumType(ConditionCategory, {
  name: 'ConditionCategory',
  description: 'Categories of detected vehicle surface conditions',
});

registerEnumType(ConditionSeverity, {
  name: 'ConditionSeverity',
  description: 'Severity levels of vehicle surface flaws',
});

@ObjectType()
export class DetectedConditionType {
  @Field()
  id: string;

  @Field(() => ConditionCategory)
  category: ConditionCategory;

  @Field()
  name: string;

  @Field(() => ConditionSeverity)
  severity: ConditionSeverity;

  @Field(() => Float)
  confidenceScore: number;

  @Field()
  summary: string;
}

@ObjectType()
export class RecommendedPackageType {
  @Field()
  packageId: string;

  @Field()
  title: string;

  @Field()
  reason: string;

  @Field(() => [String])
  suggestedAddons: string[];
}

@ObjectType()
export class VehicleScanResultType {
  @Field()
  isVehicleDetected: boolean;

  @Field(() => Int)
  overallConditionScore: number;

  @Field(() => [DetectedConditionType])
  detectedConditions: DetectedConditionType[];

  @Field(() => RecommendedPackageType)
  recommendedPackage: RecommendedPackageType;

  @Field({ nullable: true })
  retakeGuidance?: string;
}
