import { ConditionCategory } from '../../domain/enums/condition-category.enum';
import { ConditionSeverity } from '../../domain/enums/condition-severity.enum';
import { VehicleScanResultEntity } from '../../domain/entities/vehicle-scan-result.entity';

export const GEMINI_VEHICLE_ANALYSIS_PROMPT = `
You are an expert automotive detailing technician. Analyze the provided vehicle photos and respond in strict JSON adhering to this structure:
{
  "isVehicleDetected": true,
  "overallConditionScore": 6,
  "detectedConditions": [
    {
      "id": "cond_1",
      "category": "DIRT",
      "name": "Moderate Road Grime & Dust",
      "severity": "MODERATE",
      "confidenceScore": 0.92,
      "summary": "Accumulation of road film and dust on lower body panels."
    },
    {
      "id": "cond_2",
      "category": "PAINT",
      "name": "Light Swirl Marks",
      "severity": "LIGHT",
      "confidenceScore": 0.88,
      "summary": "Micro-scratches visible under direct light on clear coat."
    }
  ],
  "recommendedPackage": {
    "packageId": "deluxe_foam_detailing",
    "title": "Deluxe Foam Wash & Decontamination",
    "reason": "Recommended to safely strip road grime and apply clear coat protection.",
    "suggestedAddons": ["clay_bar_treatment", "tire_shine"]
  }
}
` as const;

export const FALLBACK_SCAN_RESULT = new VehicleScanResultEntity({
  isVehicleDetected: true,
  overallConditionScore: 7,
  detectedConditions: [
    {
      id: 'cond_dirt_1',
      category: ConditionCategory.DIRT,
      name: 'Moderate Road Grime & Mud',
      severity: ConditionSeverity.MODERATE,
      confidenceScore: 0.94,
      summary: 'Visible road dust and dried splatter detected on wheel wells.',
    },
    {
      id: 'cond_paint_1',
      category: ConditionCategory.PAINT,
      name: 'Light Swirl Marks',
      severity: ConditionSeverity.LIGHT,
      confidenceScore: 0.89,
      summary: 'Minor clear coat swirl marks detected under direct lighting.',
    },
    {
      id: 'cond_wheels_1',
      category: ConditionCategory.WHEELS,
      name: 'Brake Dust Buildup',
      severity: ConditionSeverity.MODERATE,
      confidenceScore: 0.91,
      summary: 'Standard metallic brake dust accumulation on front rim spokes.',
    },
  ],
  recommendedPackage: {
    packageId: 'deluxe_ceramic_wash',
    title: 'Deluxe Foam Wash & Paint Protection',
    reason:
      'AI analysis recommends a multi-stage foam wash paired with wheel iron decontaminant.',
    suggestedAddons: ['clay_bar_decon', 'ceramic_tire_glaze'],
  },
});
