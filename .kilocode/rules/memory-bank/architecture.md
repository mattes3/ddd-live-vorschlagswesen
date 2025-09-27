# System Architecture

## Overview

The project follows a strict Domain-Driven Design (DDD) approach with hexagonal architecture, organized as a monorepo using pnpm workspaces and Turbo for build orchestration. The application is structured into bounded contexts with clear separation of domain logic, infrastructure adapters, and presentation layers.

## Source Code Structure

### Root Level
- `packages/`: Monorepo packages organized by concern
- `config/`: Shared TypeScript configuration
- `scripts/`: Build and development utilities

### Package Organization

#### Domain Logic (`packages/domainlogic/`)
- `benutzer/`: User domain (Benutzer entity)
- `vorschlag/`: Proposal domain (Vorschlag entity, services, repositories)

#### Infrastructure Support (`packages/domain-support/`)
- `database/`: Database connection and transaction helpers
- `logger/`: Pino-based logging configuration
- `modellierung/`: Domain modeling utilities (events, errors, types)

#### Container Support (`packages/container-support/`)
- `webtech/`: Web framework utilities (Hono middleware, CSRF, caching)

#### Common Frontend (`packages/common-frontend/`)
- Shared frontend assets (HTMX, Tailwind, Handlebars templates)

#### Containers (`packages/containers/`)
- `homepage/`: Landing page container
- `vorschlag/`: Proposal management container

## Key Architectural Decisions

### Domain-Driven Design Patterns
- **Entities**: Vorschlag with business logic methods
- **Value Objects**: VorschlagsZustand enum, Aufwand, ZeitRahmen
- **Domain Events**: VorschlagHinzugefuegtEvent, VorschlagEingereichtEvent
- **Domain Services**: VorschlagService for use case orchestration
- **Repositories**: VorschlagRepository interface with PostgreSQL implementation

### Hexagonal Architecture
- **Domain Layer**: Pure business logic in `domainlogic/` packages
- **Application Layer**: Use case services coordinating domain objects
- **Infrastructure Layer**: Adapters for persistence (`adapter/persistence/`) and web UI (`adapter/webui/`)
- **Presentation Layer**: Hono routes and HTMX-powered frontend

### Technical Stack Decisions
- **Backend Framework**: Hono for lightweight, fast HTTP handling
- **Frontend**: HTMX for dynamic interactions without JavaScript complexity
- **Database**: PostgreSQL with Knex query builder and Objection.js ORM
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tool**: Turbo for monorepo orchestration
- **Package Manager**: pnpm for efficient dependency management

## Component Relationships

### Domain Layer Flow
```
WebUI Adapter → Domain Service → Repository Interface → Persistence Adapter → Database
```

### Container Structure
Each container follows the same pattern:
- `backend/`: Hono application with routes and adapters
- `frontend/`: Vite-built static assets with HTMX integration

### Dependency Direction
Dependencies flow inward from infrastructure to domain:
- Infrastructure depends on domain interfaces
- Domain has no external dependencies
- Application services coordinate domain objects

## Critical Implementation Paths

### Proposal Submission
1. HTMX form posts to `/vorschlag/nc/vorschlaege`
2. VorschlagHinzufuegenHandler receives request
3. Domain service validates and creates Vorschlag entity
4. Repository persists to PostgreSQL
5. Domain events published (for future event handling)

### Proposal Listing
1. GET `/vorschlag/` renders index page
2. HTMX loads proposal list dynamically
3. Repository fetches all Vorschlag entities
4. Handlebars templates render German UI

## Design Patterns in Use

- **Repository Pattern**: Abstraction over data persistence
- **Dependency Injection**: Container-based service resolution
- **Command Pattern**: FuegeVorschlagHinzuCommand, ReicheVorschlagEinCommand
- **Event Sourcing**: Domain events for state changes (foundation laid)
- **CQRS**: Separate read/write models (potential future enhancement)