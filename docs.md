# Project Documentation: NestJS with GraphQL & Clean Architecture

## 1. Project Overview
This project is a boilerplate for a scalable backend application built with **NestJS** and **GraphQL**, structured using **Domain-Driven Design (DDD)** and **Clean Architecture** principles.

## 2. Directory Structure & Naming Conventions
```
src/
├── common/                  # Global shared code
│   ├── domain/              # Shared base entities, value objects
│   ├── infrastructure/      # Shared repos, security middleware
│   └── security/            # Global security guards/strategies
├── modules/                 # Feature modules (Business Features)
│   └── items/               # The 'Items' feature
│       ├── domain/          # 1. CORE: Entities, Value Objects, Rules
│       ├── application/     # 2. LOGIC: Services, Use Cases, DTOs
│       ├── presentation/    # 3. API: Resolvers, Controllers
│       ├── infrastructure/  # 4. DATA: Repositories, Entities (DB)
│       └── items.module.ts  # Module wiring
└── app.module.ts            # Root module
```

## 3. The Layers (Deep Dive)

### Layer 1: Domain (`src/modules/*/domain`)
**"The Heart"** - Pure business logic.
*   **Entities**: Mutable objects with an identity (e.g., `ItemEntity`).
*   **Value Objects** (Advanced): Immutable objects defined by their attributes (e.g., `ItemName`, `Email`).
*   **Repositories (Interfaces)**: Contracts defining *how* to save/load data.

### Layer 2: Application (`src/modules/*/application`)
**"The Brain"** - Orchestration.
*   **Services**: Methods that execute business actions (e.g., `createItem`).
*   **DTOs**: Data Transfer Objects defining input/output shapes.

### Layer 3: Presentation (`src/modules/*/presentation`)
**"The Doorway"** - API Interface.
*   **Resolvers**: GraphQL entry points.
*   **Guards**: Auth & Permission checks.

### Layer 4: Infrastructure (`src/modules/*/infrastructure`)
**"The Engine"** - External details.
*   **Persistence**: Database implementations (TypeORM/Mongo), Mappers.
*   **Strategies**: Passport Auth strategies (JWT).

## 4. Security Architecture (New)

### A. Infrastructure (Middleware)
*   **Helmet**: Secure HTTP Headers (XSS, No-Sniff).
*   **Throttler**: Rate limiting protection.

### B. Presentation (Guards)
*   **JwtAuthGuard**: Validates user identity.
*   **RolesGuard**: Validates user permissions.

## 5. Advanced DDD Patterns (Implementation Roadmap)

### A. Value Objects (`domain/value-objects`)
**Concept**: Replaces primitive types (`string`, `number`) with rich objects.
*   **Why?**: Enforces validation *once*. A `Email` object guarantees it contains a valid email. You never have to check `@` again.
*   **Example**: `ItemName` ensures the name is always at least 3 chars long.

### B. Domain Events (`domain/events`)
**Concept**: Decouples side-effects.
*   **Why?**: When an Item is created, emit `ItemCreatedEvent`. A listener sends an email. The Service doesn't need to know about emails.

### C. Aggregates (`domain/aggregates`)
**Concept**: A cluster of objects treated as a unit.
*   **Why?**: Ensures data consistency. An `Order` enforces that `OrderItems` cannot exist without it.
