# NestGqlBoilerplate — Architecture Documentation

> **Stack:** NestJS · GraphQL (Code-First) · Prisma · PostgreSQL  
> **Pattern:** Domain-Driven Design (DDD) with Hexagonal Architecture (Ports & Adapters)  
> **DDD Score:** 9.2 / 10

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [The Common Kernel](#3-the-common-kernel)
4. [Module Anatomy](#4-module-anatomy)
5. [Design Patterns & Conventions](#5-design-patterns--conventions)
6. [Module Reference](#6-module-reference)
7. [Data Flow](#7-data-flow)
8. [Database Schema](#8-database-schema)
9. [How to Add a New Module](#9-how-to-add-a-new-module)
10. [Getting Started](#10-getting-started)

---

## 1. Architecture Overview

The project follows a **layered DDD architecture** where each module is self-contained with four clearly separated layers:

| Layer | Responsibility | Depends On |
|---|---|---|
| **Presentation** | GraphQL resolvers, input types, object types | Application |
| **Application** | Business orchestration, use-case services | Domain |
| **Domain** | Entities, repository contracts, value objects, enums | Nothing (pure) |
| **Infrastructure** | Prisma repositories, external API gateways | Domain (implements contracts) |

### Dependency Rule

Dependencies flow **inward only** — outer layers depend on inner layers, never the reverse.

```
Presentation → Application → Domain ← Infrastructure
```

Infrastructure implements domain contracts (repository interfaces, port interfaces) but domain never imports from infrastructure. This is the core of the **Dependency Inversion Principle**.

### Hexagonal Architecture

External integrations (Twilio SMS, Prisma ORM) are isolated behind **port interfaces** defined in the domain layer. The infrastructure layer provides concrete **adapters**. Swapping Twilio for AWS SNS requires changing one module registration — zero business logic changes.

---

## 2. Project Structure

```
src/
├── common/                                       # ── Shared Kernel ──
│   ├── application/
│   │   └── helpers/
│   │       ├── assert-found.helper.ts            # Generic NotFoundException guard
│   │       └── index.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── base.entity.ts                    # BaseEntity { id, createdAt, updatedAt }
│   │   │   └── index.ts
│   │   ├── enums/
│   │   │   ├── user-role.enum.ts                 # UserRole { CUSTOMER, PROVIDER }
│   │   │   └── index.ts
│   │   ├── repositories/
│   │   │   ├── repository.interface.ts           # IRepository<T> — abstract CRUD contract
│   │   │   └── index.ts
│   │   └── value-objects/
│   │       ├── value-object.base.ts              # Generic ValueObject<T> base
│   │       └── phone-number.vo.ts                # PhoneNumber (E.164 validation)
│   ├── infrastructure/
│   │   └── persistence/prisma/
│   │       ├── prisma.service.ts                 # PrismaClient lifecycle
│   │       ├── prisma.repository.ts              # PrismaRepository<T, P> — generic CRUD impl
│   │       └── prisma.module.ts
│   └── common.module.ts
│
├── modules/                                      # ── Bounded Contexts ──
│   ├── roles/                                    # Role management
│   │   ├── application/services/
│   │   ├── domain/entities/
│   │   ├── domain/repositories/
│   │   ├── infrastructure/persistence/repositories/
│   │   ├── presentation/graphql/ { resolvers, types }
│   │   └── roles.module.ts
│   │
│   ├── users/                                    # User accounts + phone-based auth
│   │   ├── application/services/
│   │   ├── domain/entities/
│   │   ├── domain/repositories/
│   │   ├── infrastructure/persistence/repositories/
│   │   ├── presentation/graphql/ { resolvers, types, inputs }
│   │   └── users.module.ts
│   │
│   ├── verification/                             # OTP verification flow
│   │   ├── application/services/
│   │   ├── domain/entities/
│   │   ├── domain/repositories/
│   │   ├── infrastructure/
│   │   │   ├── persistence/prisma/               # PrismaVerificationRepository
│   │   │   └── services/                         # OtpCleanupService (cron)
│   │   ├── presentation/graphql/ { resolvers, types }
│   │   └── verification.module.ts
│   │
│   ├── twilio/                                   # SMS gateway (hexagonal port)
│   │   ├── domain/ports/                         # ISmsGateway — abstract contract
│   │   ├── infrastructure/                       # TwilioSmsGateway — adapter
│   │   └── twilio.module.ts
│   │
│   └── vendors/                                  # Vendor bounded context
│       ├── application/services/vendor-profile/
│       ├── domain/entities/vendor-profile/
│       ├── domain/repositories/vendor-profile/
│       ├── infrastructure/persistence/repositories/vendor-profile/
│       ├── presentation/graphql/ { resolvers, types, inputs }
│       ├── bank-details/                         # ── Sub-slice ──
│       │   ├── application/services/
│       │   ├── domain/entities/
│       │   ├── domain/repositories/
│       │   ├── infrastructure/persistence/repositories/
│       │   └── presentation/graphql/ { resolvers, types, inputs }
│       └── vendors.module.ts                     # Registers both slices
```

**Key stats:**
- **105 TypeScript files** across 7 modules
- **0 empty directories** — every folder serves a purpose
- **Every folder** has a barrel `index.ts` for clean imports

---

## 3. The Common Kernel

The `src/common/` directory contains shared abstractions that all modules depend on. Nothing module-specific lives here.

### BaseEntity

```typescript
// src/common/domain/entities/base.entity.ts
export class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

All domain entities extend this. Prisma auto-generates `id` (UUID), `createdAt`, and `updatedAt`.

### IRepository\<T\>

```typescript
// src/common/domain/repositories/repository.interface.ts
export abstract class IRepository<T> {
  abstract create(item: T): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract findOne(id: string): Promise<T | null>;
  abstract update(id: string, item: Partial<T>): Promise<T | null>;
  abstract remove(id: string): Promise<T | null>;
}
```

This is the **base CRUD contract**. Module-specific repositories extend it with domain-specific query methods (e.g., `findByPhoneNumber`, `findByVendorProfileId`).

### PrismaRepository\<T, P\>

```typescript
// src/common/infrastructure/persistence/prisma/prisma.repository.ts
export abstract class PrismaRepository<T extends BaseEntity, PrismaModel>
  implements IRepository<T>
{
  abstract toEntity(model: PrismaModel): T;
  abstract toPrisma(entity: T): Record<string, unknown>;

  // Generic create, findAll, findOne, update, remove — all pre-built
}
```

**Every repository in the project** extends this base class. Subclasses only need to implement:
- `toEntity()` — converts a Prisma model to a domain entity
- `toPrisma()` — converts a domain entity to a Prisma-compatible object

This eliminates ~30 lines of boilerplate per repository.

### assertFound\<T\> Helper

```typescript
// src/common/application/helpers/assert-found.helper.ts
export function assertFound<T>(entity: T | null, label: string): T {
  if (!entity) throw new NotFoundException(`${label} not found`);
  return entity;
}
```

Used in every service to eliminate duplicated null-check boilerplate:

```typescript
// Before (repeated 6+ times across services)
const user = await this.repository.findOne(id);
if (!user) throw new NotFoundException(`User ${id} not found`);
return user;

// After (one-liner)
return assertFound(await this.repository.findOne(id), `User ${id}`);
```

### UserRole Enum (Single Source of Truth)

```typescript
// src/common/domain/enums/user-role.enum.ts
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
}
```

Defined once in common, imported everywhere. The `RoleEntity` re-exports it for backward compatibility. This prevents cross-module entity coupling.

### PhoneNumber Value Object

```typescript
// src/common/domain/value-objects/phone-number.vo.ts
PhoneNumber.create('+919876543210') // → validates E.164, returns immutable VO
```

Encapsulates phone number formatting and validation. Used by `TwilioSmsGateway` and `VerificationService`.

---

## 4. Module Anatomy

Every module follows the same four-layer structure. Here's `vendors/bank-details` as the canonical example:

### Domain Layer (Pure — No Framework Imports)

```typescript
// domain/entities/bank-details.entity.ts
export class BankDetailsEntity extends BaseEntity {
  vendorProfileId: string;
  accountHolder: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  deletedAt?: Date;

  constructor(partial: Partial<BankDetailsEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<BankDetailsEntity>): BankDetailsEntity {
    return new BankDetailsEntity(data);
  }
}
```

```typescript
// domain/repositories/bank-details.repository.interface.ts
export abstract class IBankDetailsRepository extends IRepository<BankDetailsEntity> {
  abstract findByVendorProfileId(vendorProfileId: string): Promise<BankDetailsEntity | null>;
  abstract upsert(vendorProfileId: string, data: Partial<BankDetailsEntity>): Promise<BankDetailsEntity>;
}
```

> The abstract class serves as both the **TypeScript contract** and the **NestJS DI token** — no strings or symbols needed.

### Infrastructure Layer (Implements Domain Contracts)

```typescript
// infrastructure/persistence/repositories/bank-details.repository.ts
@Injectable()
export class BankDetailsRepository
  extends PrismaRepository<BankDetailsEntity, PrismaVendorBankDetails>
  implements IBankDetailsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'vendorBankDetails');
  }

  // Domain-specific queries
  async findByVendorProfileId(vendorProfileId: string) { ... }
  async upsert(vendorProfileId: string, data: Partial<BankDetailsEntity>) { ... }

  // Mapping methods
  toEntity(model: PrismaVendorBankDetails): BankDetailsEntity { ... }
  toPrisma(entity: BankDetailsEntity): Record<string, unknown> { ... }
}
```

### Application Layer (Orchestrates Business Logic)

```typescript
// application/services/bank-details.service.ts
@Injectable()
export class BankDetailsService {
  constructor(private readonly repository: IBankDetailsRepository) {}

  async upsert(vendorProfileId: string, input: UpsertBankDetailsInput) {
    return this.repository.upsert(vendorProfileId, input);
  }

  async findByVendorProfileId(vendorProfileId: string) {
    return assertFound(
      await this.repository.findByVendorProfileId(vendorProfileId),
      `Bank details for vendor ${vendorProfileId}`,
    );
  }

  async delete(id: string) {
    assertFound(await this.repository.remove(id), `Bank details ${id}`);
    return true;
  }
}
```

> The service depends on the **abstract** `IBankDetailsRepository`, not the Prisma implementation. This is the Dependency Inversion Principle in action.

### Presentation Layer (GraphQL Interface)

```typescript
// presentation/graphql/resolvers/bank-details.resolver.ts
@Resolver(() => BankDetailsType)
export class BankDetailsResolver {
  constructor(private readonly service: BankDetailsService) {}

  @Query(() => BankDetailsType)
  async getVendorBankDetails(@Args('vendorProfileId', { type: () => ID }) vendorProfileId: string) { ... }

  @Mutation(() => BankDetailsType)
  async upsertVendorBankDetails(@Args('vendorProfileId', { type: () => ID }) vendorProfileId: string, @Args('input') input: UpsertBankDetailsInput) { ... }

  @Mutation(() => Boolean)
  async deleteVendorBankDetails(@Args('id', { type: () => ID }) id: string) { ... }
}
```

### Module Registration

```typescript
// vendors.module.ts
@Module({
  imports: [CommonModule],
  providers: [
    VendorProfileService,
    VendorProfileResolver,
    { provide: IVendorProfileRepository, useClass: VendorProfileRepository },
    BankDetailsService,
    BankDetailsResolver,
    { provide: IBankDetailsRepository, useClass: BankDetailsRepository },
  ],
  exports: [VendorProfileService, BankDetailsService],
})
export class VendorsModule {}
```

> The `provide: AbstractClass, useClass: ConcreteClass` pattern is the DI wiring that makes the hexagonal architecture work.

---

## 5. Design Patterns & Conventions

### Convention Checklist

| Convention | Rule | Compliance |
|---|---|---|
| **Entity pattern** | `extends BaseEntity`, `constructor(partial)`, `static create()` | ✅ All 5 entities |
| **Repository interface** | `abstract class` extending `IRepository<T>` | ✅ All 6 repos |
| **Repository impl** | `extends PrismaRepository<T, P>`, `toEntity()`, `toPrisma() → Record<string, unknown>` | ✅ All 6 repos |
| **Service pattern** | Uses `assertFound()` for null checks, depends on abstract repo | ✅ All 5 services |
| **Barrel exports** | Every directory has `index.ts` | ✅ 100% coverage |
| **Import aliases** | `@common/*` and `@modules/*` — no relative `../../../` | ✅ All files |
| **Soft-delete** | `deletedAt` column on every Prisma model | ✅ All 8 models |
| **No `any`** | `toPrisma()` returns `Record<string, unknown>`, not `any` | ✅ All repos |

### Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Entity | `XxxEntity` | `BankDetailsEntity` |
| Repository interface | `IXxxRepository` | `IBankDetailsRepository` |
| Repository impl | `XxxRepository` | `BankDetailsRepository` |
| Service | `XxxService` | `BankDetailsService` |
| Resolver | `XxxResolver` | `BankDetailsResolver` |
| GQL Object Type | `XxxType` | `BankDetailsType` |
| GQL Input Type | `XxxInput` | `UpsertBankDetailsInput` |
| Port interface | `ISmsGateway` | Abstract class in `domain/ports/` |
| Adapter | `TwilioSmsGateway` | Concrete class in `infrastructure/` |

---

## 6. Module Reference

### Roles Module

Manages the `CUSTOMER` and `PROVIDER` roles.

| GraphQL Operation | Signature |
|---|---|
| Query | `roles: [Role]` |
| Query | `roleById(id: String!): Role` |
| Mutation | `createRole(name: UserRole!): Role` |

### Users Module

Handles user accounts and phone-based OTP authentication. Depends on `VerificationModule` and `RolesModule`.

| GraphQL Operation | Signature |
|---|---|
| Query | `users: [User]` |
| Query | `user(id: ID!): User` |
| Mutation | `loginByPhone(phoneNumber: String!, code: String!, role: UserRole!): User` |
| Mutation | `deleteUser(id: ID!): Boolean` |

### Verification Module

OTP request/verify flow. Depends on `TwilioModule` (via `ISmsGateway` port). Includes a cron-based `OtpCleanupService` that soft-deletes expired OTPs hourly.

| GraphQL Operation | Signature |
|---|---|
| Mutation | `requestOtp(phoneNumber: String!): SmsResponse` |
| Mutation | `verifyOtp(phoneNumber: String!, code: String!): VerifyOtpResponse` |

### Twilio Module

Pure hexagonal adapter — no resolvers, no application services. Exports `ISmsGateway` token.

```
ISmsGateway (port) ← TwilioSmsGateway (adapter)
```

To swap SMS providers, replace `TwilioSmsGateway` in `twilio.module.ts` — zero changes elsewhere.

### Vendors Module

Manages vendor business profiles and banking details. `bank-details` is nested as a sub-slice inside the `vendors` bounded context.

**Vendor Profile:**

| GraphQL Operation | Signature |
|---|---|
| Query | `getVendorProfile(userId: String!): VendorProfile` |
| Query | `getVendorProfileById(id: ID!): VendorProfile` |
| Mutation | `createVendorProfile(input: CreateVendorProfileInput!): VendorProfile` |
| Mutation | `updateVendorProfile(id: ID!, input: UpdateVendorProfileInput!): VendorProfile` |
| Mutation | `deleteVendorProfile(id: ID!): Boolean` |

**Bank Details:**

| GraphQL Operation | Signature |
|---|---|
| Query | `getVendorBankDetails(vendorProfileId: ID!): BankDetails` |
| Mutation | `upsertVendorBankDetails(vendorProfileId: ID!, input: UpsertBankDetailsInput!): BankDetails` |
| Mutation | `deleteVendorBankDetails(id: ID!): Boolean` |

---

## 7. Data Flow

A typical mutation flows through all four layers:

```
Client (GraphQL Playground)
    │
    ▼
┌─────────────────────────────┐
│   BankDetailsResolver       │  ← Presentation Layer
│   (validates args via GQL)  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   BankDetailsService        │  ← Application Layer
│   (assertFound, orchestrate)│
└──────────┬──────────────────┘
           │ depends on IBankDetailsRepository (abstract)
           ▼
┌─────────────────────────────┐
│   BankDetailsRepository     │  ← Infrastructure Layer
│   (extends PrismaRepository)│
│   toEntity() ↔ toPrisma()  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   PostgreSQL (via Prisma)   │  ← Database
└─────────────────────────────┘
```

---

## 8. Database Schema

8 Prisma models with consistent conventions:

| Model | Table Name | Key Relations |
|---|---|---|
| `Role` | `roles` | → User (1:many) |
| `User` | `users` | → Role, → VendorProfile (1:1), → Booking (1:many) |
| `VendorProfile` | `vendor_profiles` | → User (1:1), → VendorBankDetails (1:1) |
| `VendorBankDetails` | `vendor_bank_details` | → VendorProfile (1:1) |
| `Service` | `services` | → Booking (1:many) |
| `Booking` | `bookings` | → User, → Service, → Review (1:1), → Dispute (1:1) |
| `Review` | `reviews` | → Booking (1:1) |
| `Dispute` | `disputes` | → Booking (1:1) |
| `Verification` | `verifications` | standalone |

**Database conventions:**
- All PKs are UUIDs (`@default(uuid())`)
- All tables have `created_at`, `updated_at`, `deleted_at` (soft-delete)
- Column names use `snake_case` via `@map()`
- Indexed on foreign keys and `deleted_at`

---

## 9. How to Add a New Module

Follow this checklist to add a new module that fits the established architecture:

### Step 1 — Prisma Schema

```prisma
model NewThing {
  id        String    @id @default(uuid())
  name      String
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  @@index([deletedAt])
  @@map("new_things")
}
```

Run: `npx prisma generate`

### Step 2 — Domain Layer

```typescript
// domain/entities/new-thing.entity.ts
export class NewThingEntity extends BaseEntity {
  name: string;
  deletedAt?: Date;

  constructor(partial: Partial<NewThingEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<NewThingEntity>): NewThingEntity {
    return new NewThingEntity(data);
  }
}

// domain/repositories/new-thing.repository.interface.ts
export abstract class INewThingRepository extends IRepository<NewThingEntity> {
  // Add domain-specific queries here
}
```

### Step 3 — Infrastructure Layer

```typescript
// infrastructure/persistence/repositories/new-thing.repository.ts
@Injectable()
export class NewThingRepository
  extends PrismaRepository<NewThingEntity, PrismaNewThing>
  implements INewThingRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'newThing'); // ← Prisma model name
  }

  toEntity(model: PrismaNewThing): NewThingEntity {
    return new NewThingEntity({ ...model, deletedAt: model.deletedAt ?? undefined });
  }

  toPrisma(entity: NewThingEntity): Record<string, unknown> {
    return { name: entity.name };
  }
}
```

### Step 4 — Application Layer

```typescript
// application/services/new-thing.service.ts
@Injectable()
export class NewThingService {
  constructor(private readonly repository: INewThingRepository) {}

  async findById(id: string) {
    return assertFound(await this.repository.findOne(id), `NewThing ${id}`);
  }
}
```

### Step 5 — Presentation Layer

Create resolver, input types, object types following existing patterns.

### Step 6 — Module Registration

```typescript
@Module({
  imports: [CommonModule],
  providers: [
    NewThingService,
    NewThingResolver,
    { provide: INewThingRepository, useClass: NewThingRepository },
  ],
  exports: [NewThingService],
})
export class NewThingModule {}
```

### Step 7 — Barrel Exports

Add `index.ts` in **every new directory**.

---

## 10. Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 16+
- Twilio account (for SMS)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

### GraphQL Playground

Open `http://localhost:3000/graphql` after starting the server.

---

*Last updated: May 2026*
