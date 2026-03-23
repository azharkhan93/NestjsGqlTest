---
description: DDD-based GraphQL architecture with Prisma. Enforce SOLID, reusable code, optimized database design, and high-performance queries for scalable backend systems.
---

# Core Principles

- Follow SOLID principles strictly:
  - S → Single Responsibility
  - O → Open/Closed
  - L → Liskov Substitution
  - I → Interface Segregation
  - D → Dependency Inversion

- Code must be:
  - reusable
  - testable
  - modular
  - scalable

- NEVER:
  - duplicate logic across modules
  - tightly couple layers

# Structure Rules

src/
  common/        → shared utilities, base classes
  modules/
    feature/
      application/     → use cases ONLY
      domain/          → entities, interfaces
      infrastructure/  → prisma, external services
      presentation/    → graphql resolvers

Rules:

- domain:
  - pure business logic
  - no external dependencies

- application:
  - orchestrates use cases
  - depends on domain interfaces only

- infrastructure:
  - implements repositories
  - contains Prisma logic

- presentation:
  - GraphQL resolvers ONLY
  - no business logic

- common:
  - reusable helpers
  - base repository
  - constants

# Database Design Rules

- Use UUID as primary key
- Every table must include:
  - id
  - createdAt
  - updatedAt
  - deletedAt (soft delete)

- Naming:
  - snake_case for DB
  - camelCase for code

- Avoid:
  - storing computed data
  - storing arrays when relational tables are better

- Relations:
  - always use proper foreign keys
  - avoid JSON unless required

- Transactions:
  - use Prisma transactions for multi-step operations

# Indexing Rules

- MUST add index on:
  - all foreign keys
  - frequently filtered fields
  - sorting fields (ORDER BY)

- Composite indexes:
  - use for multi-condition queries
  - e.g (userId, createdAt)

- Unique indexes:
  - emails, usernames, identifiers

- Avoid:
  - over-indexing (slows writes)
  - indexing low-cardinality fields

- Always analyze queries before adding indexes

# Normalization Rules

- Follow 3NF (Third Normal Form)

- Ensure:
  - no duplicate data
  - each column depends on primary key only

- Split tables when:
  - repeated groups exist
  - large nullable columns appear

- Use join tables for:
  - many-to-many relations

- Denormalize ONLY when:
  - performance requires it
  - and document the reason
# Query Optimization

- NEVER fetch unnecessary fields
- Use select/include in Prisma explicitly

- Prevent N+1:
  - implement DataLoader in GraphQL layer

- Pagination:
  - use cursor-based pagination
  - avoid offset for large data

- Avoid:
  - nested heavy queries
  - multiple DB calls in loops

- Prefer:
  - batch queries
  - aggregation queries when needed
# Reusability Rules

- Move shared logic to /common:
  - base repository
  - utility functions
  - constants

- Use:
  - abstract classes
  - interfaces

- Create:
  - BaseService
  - BaseRepository

- DTO reuse:
  - shared DTOs where possible
  - avoid duplication

- Validation:
  - centralized validation logic

# Repository Rules

- Domain defines repository interfaces
- Infrastructure implements them using Prisma

- NEVER:
  - use Prisma directly in application layer

- Repository should:
  - return domain entities
  - not raw DB models

- Keep queries optimized and minimal

# GraphQL Rules

- Resolver responsibilities:
  - receive request
  - validate input
  - call application service

- DO NOT:
  - write business logic
  - call Prisma directly

- Use:
  - DTOs for inputs/outputs
  - guards for auth

- Implement:
  - DataLoader for relations

# Clean Code Rules

- Functions:
  - small and focused
  - single responsibility

- Naming:
  - meaningful and consistent

- Avoid:
  - long functions
  - deep nesting
  - magic numbers

- Use:
  - constants
  - enums

- Keep:
  - files small and modular

# Scalability Rules

- Design modules independently
- Avoid cross-module tight coupling

- Prepare for:
  - multi-tenancy (tenantId)
  - sharding (userId / tenantId)

# Security Rules

- Validate all inputs (DTOs)
- Sanitize inputs
- Use guards for auth

- Never expose:
  - internal DB fields
  - sensitive data

- Apply:
  - rate limiting







