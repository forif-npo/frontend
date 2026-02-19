# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **FORIF Frontend monorepo** - a Turborepo-based monorepo for 한양대학교 중앙 개발 동아리 FORIF's web applications.

**Repository Structure:**

- **apps/web**: Member and mentor homepage (port 3000)
- **apps/admin**: Operator management system (port 3001)
- **packages**: Shared libraries and configurations

## Critical Requirements

### Package Manager

**MANDATORY**: This project MUST use **pnpm** (v10.10.0).

- **NEVER** use npm or yarn
- **ALWAYS** use pnpm for all package management operations
- The monorepo is configured with pnpm workspaces
- Using other package managers will break dependency resolution

### Code Quality

All code changes must pass these checks before committing:

```bash
pnpm lint                # ESLint validation
pnpm type-check          # TypeScript type checking
pnpm test                # Jest tests
```

Use `pnpm commit` for Conventional Commits format with commitlint validation.

## Monorepo Commands

All commands should be run from the monorepo root (`/Users/standardwish/Documents/Projects/frontend/`):

```bash
# Development
pnpm dev                 # Run all apps in development mode
pnpm dev --filter=web    # Run only web app (port 3000)
pnpm dev --filter=admin  # Run only admin app (port 3001)

# Building
pnpm build               # Build all apps and packages
pnpm build --filter=web  # Build only web app
pnpm build --filter=admin # Build only admin app

# Code Quality
pnpm lint                # Lint all packages
pnpm lint:fix            # Auto-fix linting issues
pnpm type-check          # Type check all packages
pnpm test                # Run all tests
pnpm test:watch          # Run tests in watch mode

# Formatting & Commits
pnpm format              # Format code with Prettier
pnpm commit              # Guided commit with Conventional Commits

# Storybook
pnpm storybook           # Run Storybook for component development
pnpm build-storybook     # Build Storybook for deployment

# Cleanup
turbo clean              # Clean all build outputs and caches
```

## Architecture

### Monorepo Structure

```
frontend/
├── apps/
│   ├── web/              # Member/mentor homepage (Next.js 15, React 19)
│   └── admin/            # Operator admin system (Next.js 15, React 19)
├── packages/
│   ├── ui/               # Shared React components (@repo/ui)
│   ├── core/             # Schemas, types, utilities (@repo/core)
│   ├── assets/           # Fonts, icons, images (@repo/assets)
│   ├── eslint-config/    # ESLint presets (@repo/eslint-config)
│   ├── typescript-config/ # TypeScript configs (@repo/typescript-config)
│   ├── tailwind-config/  # Tailwind CSS config (@repo/tailwind-config)
│   └── jest-presets/     # Jest configuration (@repo/jest-presets)
├── .storybook/           # Storybook configuration
├── stories/              # Storybook stories
├── turbo.json            # Turborepo configuration
└── pnpm-workspace.yaml   # pnpm workspace configuration
```

### Shared Packages

**@repo/ui**: Shared React component library

- Located at `packages/ui/`
- Imported as `@ui/*` in apps
- Contains reusable UI components for both web and admin apps
- Built with React 19 and Tailwind CSS

**@repo/core**: Core utilities and types

- Located at `packages/core/`
- Imported as `@core/*` in apps
- Contains shared schemas (Zod), types, API functions, and utilities
- Used for shared business logic across apps

**@repo/assets**: Static resources

- Fonts (Pretendard GOV Variable)
- Icons and images
- Imported as `@repo/assets`

**Configuration Packages**:

- `@repo/eslint-config`: Shared ESLint rules
- `@repo/typescript-config`: Base TypeScript configurations
- `@repo/tailwind-config`: Shared Tailwind CSS setup
- `@repo/jest-presets`: Jest testing configuration

### Turborepo Configuration

The `turbo.json` defines task dependencies and caching:

- **build**: Depends on building dependencies first (`^build`)
- **lint**: Requires build to complete first
- **test**: Independent, can run in parallel
- **dev**: Persistent task, no caching
- **type-check**: No caching, always runs fresh

**Important**: Turborepo caches build outputs. If you encounter stale builds, run `turbo clean`.

### Path Aliases

Both apps use consistent path aliases (configured in their `tsconfig.json`):

- `@/*` → App-local source code (`./src/*`)
- `@ui/*` → Shared UI components (`../../packages/ui/src/*`)
- `@core/*` → Core utilities (`../../packages/core/src/*`)

## Technology Stack

### Common Stack (Both Apps)

- **Framework**: Next.js 15.4.2 with App Router
- **React**: v19.1.0
- **TypeScript**: v5
- **Styling**: Tailwind CSS v4 with CSS variables
- **Forms**: react-hook-form + @hookform/resolvers (Zod)
- **HTTP Client**: ky
- **Authentication**: NextAuth.js 5.0.0-beta.28
- **Environment Variables**: @t3-oss/env-core with Zod validation
- **URL State**: nuqs
- **Testing**: Jest with MSW (Mock Service Worker)
- **Linting**: ESLint v9
- **Package Manager**: pnpm v10.10.0

### Development Tools

- **Turborepo**: Monorepo build system with caching
- **Turbopack**: Fast development builds
- **Storybook**: Component development environment
- **Husky**: Git hooks for pre-commit checks
- **Commitlint**: Conventional Commits enforcement
- **Prettier**: Code formatting

## Development Workflow

### Working with Shared Packages

When modifying code in `packages/`:

1. **Build after changes**: Shared packages must be built before apps can use them

   ```bash
   pnpm build  # From root, builds all packages and apps
   ```

2. **Turborepo handles dependencies**: Build tasks automatically build dependencies first due to `^build` dependency in `turbo.json`

3. **Clear cache if needed**: If you encounter stale imports:

   ```bash
   turbo clean
   pnpm build
   ```

4. **Lint requires build**: The lint task depends on build completion

### Adding Dependencies

```bash
# Add to specific app
pnpm add <package> --filter=web
pnpm add <package> --filter=admin

# Add to specific package
pnpm add <package> --filter=@repo/ui

# Add to root (devDependencies)
pnpm add -D <package> -w
```

### Creating New Components

**For shared components** (used by both apps):

- Add to `packages/ui/src/components/`
- Export from `packages/ui/src/index.ts`
- Rebuild the ui package or run `pnpm dev`

**For app-specific components**:

- Web: `apps/web/src/components/`
- Admin: `apps/admin/src/components/`

### Running Specific Apps

```bash
# From root directory
pnpm dev --filter=web     # Only web app on port 3000
pnpm dev --filter=admin   # Only admin app on port 3001

# Or navigate to app directory
cd apps/web
pnpm dev                  # Port 3000

cd apps/admin
pnpm dev                  # Port 3001
```

## Git Workflow

### Commit Convention

This project uses **Conventional Commits** enforced by commitlint:

```bash
pnpm commit              # Interactive commit tool (recommended)
```

Commit message format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

### Pre-commit Hooks

Husky runs checks before commits:

- Linting
- Type checking
- Tests (if applicable)

Ensure your code passes all checks before committing.

## Docker Support

The monorepo includes Docker configuration:

```bash
# Install dependencies first
pnpm install

# Create Docker network
docker network create app_network

# Build and run containers
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d --build

# Check apps
# Web: http://localhost:3000
# Admin: http://localhost:3001

# Stop containers
docker compose -f docker-compose.yml down
```

## Important Notes

1. **Always use pnpm** - Never use npm or yarn
2. **Build before lint** - Turborepo requires dependencies to be built before linting
3. **Port awareness**: web runs on 3000, admin runs on 3001
4. **React 19**: Both apps use React 19 - be aware of breaking changes from v18
5. **Workspace dependencies**: Changes to shared packages affect all apps
6. **Turborepo caching**: Use `turbo clean` if builds seem stale
7. **Environment variables**: Each app has its own `.env` file with validated schemas
8. **Conventional Commits**: Required by commitlint - use `pnpm commit`
9. **TypeScript strict mode**: Type checking is enforced across the monorepo

## Backend API Documentation

**IMPORTANT**: All backend API schemas, endpoints, request/response types are documented in the OpenAPI specification:

- **API Spec**: [`docs/api-docs.json`](docs/api-docs.json)
- **Swagger UI**: https://dev.forif.org/swagger-ui/index.html
- **Base URL**: `http://dev.forif.org`

### **CRITICAL: Field Naming Convention**

⚠️ **All API field names use snake_case, NOT camelCase**

The OpenAPI spec (`docs/api-docs.json`) documents fields in camelCase, but **the actual backend API uses snake_case for ALL fields**:

```typescript
// ❌ WRONG - Will cause 401/400 errors
{
  accessToken: "...";
}

// ✅ CORRECT - Backend expects snake_case
{
  access_token: "...";
}
```

**Always use snake_case** for:

- Request body fields
- Query parameters
- Response data fields
- All TypeScript type definitions in `packages/core/src/types/api.d.ts`

When implementing API integrations:

1. **Always refer to `docs/api-docs.json`** for accurate endpoint paths, request/response schemas, and data types
2. **Convert camelCase to snake_case** - the spec shows camelCase but backend requires snake_case
3. **Do not guess API contracts** - read the spec file to understand request bodies, query parameters, and response formats
4. **Use TypeScript types** from `packages/core/src/types/api.d.ts` (already defined with snake_case)
5. **Check authentication requirements** - some endpoints require cookies or access tokens

Key API modules:

- **User Auth**: `/api/v1/users/*` (signup, signin, refresh, logout)
- **Staff Auth**: `/api/v1/staff/*` (staff signup/signin)
- **Studies**: `/api/v1/studies/*` (list, detail, apply)
- **Admin Studies**: `/api/v1/admin/studies/*` (manage, approve, reject)
- **Posts**: `/api/v1/posts/*` (FAQs, announcements)
- **Notifications**: `/api/v1/notifications/*` (AlimTalk)

## App-Specific Documentation

For detailed information about each app:

- **Web app**: See `apps/web/CLAUDE.md`
- **Admin app**: See `apps/admin/CLAUDE.md`

## Common Pitfalls

1. **Forgetting to build shared packages**: If you modify `@repo/ui` or `@repo/core`, you must rebuild
2. **Port conflicts**: Make sure ports 3000 and 3001 are available
3. **Using wrong package manager**: Always use pnpm, never npm/yarn
4. **Stale Turborepo cache**: Run `turbo clean` if imports seem outdated
5. **Missing environment variables**: Check `.env` files in each app directory
