# NestJS GraphQL Clean Architecture Boilerplate

This project is a high-performance, scalable boilerplate built with **NestJS**, **GraphQL (Apollo)**, and **Prisma ORM**, strictly following **Domain-Driven Design (DDD)** and **Clean Architecture** principles.

## 🚀 Project Overview

The system is designed for a service-based marketplace (e.g., Car Wash, Home Services) with support for:
- **User Management**: Roles (Customer, Provider), Profiles.
- **Service Management**: Dynamic service offerings and pricing.
- **Booking Workflow**: Scheduling, status tracking (Pending to Completed).
- **Verification**: SMS-based verification via Twilio.
- **Security**: JWT Authentication and Role-based Access Control (RBAC).

---

## 🏗️ Architecture: DDD & Clean Architecture

The project is organized into modular features, each isolated into four distinct layers to ensure separation of concerns and testability.

### 1. Folder Structure
```text
src/
├── common/                  # Shared global logic
│   ├── domain/              # Base entities, value objects, domain exceptions
│   └── infrastructure/      # Shared database config, global security guards
├── modules/                 # Feature-specific modules
│   └── [feature_name]/      # e.g., roles, verification, booking
│       ├── domain/          # Layer 1: Core business logic (Entities, Repo Interfaces)
│       ├── application/     # Layer 2: Orchestration (Services, DTOs)
│       ├── presentation/    # Layer 3: API Entry points (GraphQL Resolvers)
│       ├── infrastructure/  # Layer 4: Implementation (Prisma Repositories)
│       └── [feature].module.ts
└── main.ts                  # Entry point
```

### 2. The Layers Deep-Dive

#### **Layer 1: Domain (The Core)**
The most stable part of the system. It contains:
- **Entities**: Business objects with unique identity (e.g., `BookingEntity`).
- **Repository Interfaces**: Contracts that the Infrastructure layer must implement.
- **Value Objects**: Objects defined by attributes, not identity.

#### **Layer 2: Application (The Brain)**
Orchestrates business flow.
- **Services**: Coordinate Domain Entities and Repositories to perform tasks.
- **DTOs**: Input and Output data shapes for the API.

#### **Layer 3: Presentation (The Doorway)**
Handles the outside world.
- **GraphQL Resolvers**: Map incoming queries/mutations to Application Services.
- **Types/Inputs**: GraphQL-specific schema definitions.

#### **Layer 4: Infrastructure (The Engine)**
Technical details and external integrations.
- **Persistence**: Prisma-based implementations of Domain Repository interfaces.
- **External Services**: Twilio SMS integration, Passport strategies.

---

## 🛠️ Tech Stack & Workflow

### Core Technologies
- **NestJS**: Enterprise-grade Node.js framework.
- **GraphQL**: Apollo Server for flexible data fetching.
- **Prisma**: Type-safe database client (PostgreSQL).
- **Twilio**: SMS service for verification.
- **Passport.js**: Authentication with JWT.

### Standard Workflow (Request/Response)
1. **Request**: Resolver (`Presentation`) receives a GraphQL Mutation.
2. **Validation**: DTOs and Class-Validator ensure input integrity.
3. **Orchestration**: Service (`Application`) receives data, fetches existing data from Repository Interface.
4. **Logic**: Service interacts with Domain Entities (`Domain`) to apply business rules.
5. **Persistence**: Service calls Repository implementation (`Infrastructure`) to save changes.
6. **Response**: Data is mapped back to GraphQL Types and returned.

---

## 🛠️ Setup & Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Yarn or NPM

### Installation
```bash
yarn install
```

### Database Setup
1. Update `.env` with your `DATABASE_URL`.
2. Generate Prisma client:
```bash
yarn prisma:generate
```
3. Push schema to DB:
```bash
npx prisma db push
```

### Running the App
```bash
# Development mode
yarn start:dev

# Production build
yarn build
yarn start:prod
```

---

## 📈 Quality & Organization Audit

- **Maintainability**: High. Feature isolation ensures that changing one module doesn't break others.
- **Scalability**: High. The DDD structure allows for hundreds of modules without clutter.
- **Testability**: Very High. Business logic in `Domain` and `Application` layers is decoupled from the database and API.
- **Best Practices**: Follows SOLID principles and Clean Architecture strictly.
