# AI Vehicle Condition & Damage Analytics — Integration Guide

Comprehensive documentation for integrating, extending, and operating the production-grade **AI Vehicle Condition Scan** module built across the NestJS GraphQL backend (`NestGqlBoilerplate`) and React Native mobile client (`tab2wash`).

---

## 1. Architectural Overview

The AI Vehicle Scan module is built following **Domain-Driven Design (DDD)** and **Hexagonal Architecture (Ports & Adapters)**.

```
src/modules/ai-scan/
├── domain/
│   ├── entities/
│   │   └── vehicle-scan-result.entity.ts      # Pure Domain Entity Model
│   ├── enums/
│   │   ├── condition-category.enum.ts         # DIRT | PAINT | WHEELS | INTERIOR
│   │   └── condition-severity.enum.ts         # LIGHT | MODERATE | SEVERE
│   └── ports/
│       └── ai-scan-gateway.interface.ts       # Abstract Domain Port (IAiScanGateway)
├── application/
│   └── services/
│       └── ai-scan.service.ts                 # Use-Case Service (Injects IAiScanGateway)
├── infrastructure/
│   ├── gateways/
│   │   └── gemini.gateway.ts                  # Gemini 2.0 Flash REST Adapter + Fallback
│   └── prompts/
│       └── gemini-prompt.constants.ts         # System Prompt & Static Fallback Data
└── presentation/
    └── graphql/
        ├── resolvers/
        │   └── ai-scan.resolver.ts            # GraphQL Resolver (Auth Guarded & Rate Limited)
        └── types/
            └── vehicle-scan-result.type.ts    # GraphQL Object & Enum Types
```

---

## 2. GraphQL Schema & API Reference

### Mutation Definition

```graphql
mutation ScanVehicleCondition($base64Images: [String!]!) {
  scanVehicleCondition(base64Images: $base64Images) {
    isVehicleDetected
    overallConditionScore
    retakeGuidance
    detectedConditions {
      id
      category
      name
      severity
      confidenceScore
      summary
    }
    recommendedPackage {
      packageId
      title
      reason
      suggestedAddons
    }
  }
}
```

### GraphQL Response Types

| Type Name | Field | Return Type | Description |
| :--- | :--- | :--- | :--- |
| `VehicleScanResultType` | `isVehicleDetected` | `Boolean!` | Indicates if a valid vehicle exterior was detected. |
| | `overallConditionScore` | `Int!` | Vehicle condition rating from `1` (dirty/damaged) to `10` (pristine). |
| | `retakeGuidance` | `String` | Guidance message when `isVehicleDetected` is `false`. |
| | `detectedConditions` | `[DetectedConditionType!]!` | List of surface flaws and dirt buildup detected. |
| | `recommendedPackage` | `RecommendedPackageType!` | Suggested wash package tailored to AI analysis. |
| `DetectedConditionType` | `category` | `ConditionCategory!` | `DIRT`, `PAINT`, `WHEELS`, or `INTERIOR`. |
| | `severity` | `ConditionSeverity!` | `LIGHT`, `MODERATE`, or `SEVERE`. |
| | `confidenceScore` | `Float!` | AI confidence score (0.00 to 1.00). |
| `RecommendedPackageType`| `packageId` | `String!` | Unique service package ID. |
| | `suggestedAddons` | `[String!]!` | Array of suggested detailing add-on IDs. |

---

## 3. Backend Configuration & Setup

### Environment Variables

In `.env`:

```env
# Google Gemini 2.0 Flash API Key
GEMINI_API_KEY="AIzaSy...Your_Gemini_Key"
```

* **Fallback Mode:** If `GEMINI_API_KEY` is missing or set to `DUMMY_GEMINI_API_KEY`, `GeminiGateway` seamlessly returns `FALLBACK_SCAN_RESULT` without throwing unhandled exceptions.

### Rate Limiting & Security

* **Authentication:** Guarded with `@UseGuards(GqlAuthGuard)` requiring valid PASETO/JWT bearer token.
* **Rate Limiting:** Enforced via NestJS `@Throttle({ default: { limit: 5, ttl: 60000 } })` (max 5 scan requests per minute per IP/user).

---

## 4. Mobile React Native Integration (`tab2wash`)

### Executing the Mutation Hook

In `components/Customer/VehicleScanModal/hooks.ts`:

```typescript
import { useMutation } from '@apollo/client/react';
import { SCAN_VEHICLE_MUTATION } from './graphql';

export const useVehicleScan = (onClose: () => void) => {
  const [scanVehicleCondition] = useMutation(SCAN_VEHICLE_MUTATION);

  const executeAiScan = async (base64Photos: readonly string[]) => {
    const { data } = await scanVehicleCondition({
      variables: { base64Images: base64Photos },
    });
    return data?.scanVehicleCondition;
  };
  
  return { executeAiScan };
};
```

### Image Capture & Downscaling Specs

To prevent memory overflow and payload rejection, `cameraHelper.ts` automatically downscales photos before converting to Base64:

```typescript
launchCamera({
  mediaType: 'photo',
  quality: 0.7,
  maxWidth: 1024,
  maxHeight: 1024,
  includeBase64: true,
});
```

* Reduces camera captures from ~15MB down to **~200KB per image Base64 string**.

---

## 5. Handled Production Edge Cases

| Edge Case | Impact | Solution Implemented |
| :--- | :--- | :--- |
| **Payload Bloat (`413 Too Large`)** | Crash mobile client / NestJS payload cap. | Photos resized to `1024x1024` @ `0.7` JPEG quality in `cameraHelper.ts`. |
| **Non-Vehicle / Dark Photo** | Bad package recommendations. | Gemini detects `isVehicleDetected: false` & UI displays Retake Guidance screen. |
| **LLM JSON Formatting** | Markdown code fences (` ```json `) break `JSON.parse()`. | `GeminiGateway` strips code fences before parsing (`rawText.replace(/```json\|```/g, '')`). |
| **API Timeout / Congestion** | Mobile app hangs indefinitely. | `AbortController` 12-second timeout in `GeminiGateway` with automatic fallback fallback. |
| **Empty Image Array** | Unnecessary gateway invocation. | `AiScanResolver` throws `BadRequestException` if `base64Images.length === 0`. |

---

## 6. Testing & Verification Commands

```bash
# Run TypeScript type check on NestGqlBoilerplate
npx tsc --noEmit

# Run TypeScript type check on tab2wash React Native frontend
cd ../tab2wash && npx tsc --noEmit
```
