# Technologies and Technical Details

## Technologies Used

### Core Technologies
- **Language**: TypeScript 
- **Package Manager**: pnpm 
- **Build Orchestration**: Turbo
- **Monorepo Structure**: pnpm workspaces

### Backend
- **Web Framework**: Hono (lightweight HTTP framework)
- **Database**: PostgreSQL
- **ORM/Query Builder**: Objection.js with Knex
- **Logging**: Pino
- **Validation**: Custom domain validation

### Frontend
- **Build Tool**: Vite
- **Dynamic Interactions**: HTMX
- **Templating**: Mustache
- **Styling**: Tailwind CSS
- **Forms**: Native HTML with HTMX enhancement

### Development Tools
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Testing**: vitest (implied by test files)
- **Version Control**: Git with Changesets for releases
- **CI/CD**: GitHub Actions (release workflow)

### Domain-Driven Design Tools
- **DDD Scaffolding**: ddd-scaffolder MCP server
- **Modeling Utilities**: Custom domain modeling library (@vorschlagswesen/modellierung)

## Development Setup

### Prerequisites
- Node.js (compatible with TypeScript)
- pnpm
- PostgreSQL database
- Docker (for database containerization)

### Installation
```bash
pnpm install
```

### Database Setup
- Uses Docker Compose for PostgreSQL
- Knex migrations for schema management
- Schema: `vorschlagswesen` namespace

### Build Commands
- `pnpm build`: Build all packages with Turbo
- `pnpm lint`: Run ESLint across packages
- `pnpm prettier`: Format code with Prettier

### Development Servers
- Each container has its own dev server (nodemon + Hono)
- Frontend built with Vite
- Hot reload for development

## Technical Constraints

### Architecture Constraints
- Strict DDD adherence: Domain logic must remain pure
- Hexagonal architecture: Clear separation of concerns
- Monorepo structure: All packages in single repository
- German domain language: All business terms in German

### Code Quality Constraints
- TypeScript strict mode enabled
- ESLint rules enforced
- Prettier formatting required
- No external dependencies in domain layer

### Deployment Constraints
- AGPL 3.0 license
- Web-based only (no native apps)
- Educational focus (not production-optimized)

## Dependencies

### Root Level
- Build tools: Turbo, TypeScript, ESLint, Prettier
- Release management: Changesets

### Domain Support
- Database: Objection.js, Knex
- Logging: Pino
- Modeling: Custom utilities with ts-results-es

### Web Framework
- Hono for backend routing
- HTMX for frontend interactions
- Handlebars for templating
- Tailwind for styling

### Development
- tsx for TypeScript execution
- nodemon for dev servers
- Vite for frontend building

## Tool Usage Patterns

### MCP Server Integration
- ddd-scaffolder for generating DDD components
- Configured in `.kilocode/mcp.json`
- Generates entities, value objects, repositories, services

### Build Pipeline
- Turbo manages inter-package dependencies
- Parallel builds with dependency ordering
- Output caching for performance

### Database Development
- Knex migrations for schema changes
- Docker Compose for local database
- Objection.js models for type-safe queries

### Frontend Development
- Vite for fast development builds
- HTMX for progressive enhancement
- Tailwind for consistent styling
- Handlebars partials for reusable components