# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **admin** app within the FORIF Frontend monorepo - an administrative management system for FORIF (한양대학교 중앙 개발 동아리) operators. It's built with Next.js 15.4.2, React 19, and uses the App Router architecture.

The monorepo is located at `/Users/standardwish/Documents/Projects/frontend/` and contains:

- **apps/admin**: This operator management system (current location)
- **apps/web**: Member/mentor homepage
- **packages**: Shared packages (`@repo/ui`, `@repo/core`, `@repo/assets`, etc.)

## Development Commands

This project uses **pnpm** as the package manager. The development server runs on **port 3001** (not the default 3000).

```bash
# Development
pnpm dev                  # Start dev server on http://localhost:3001 with Turbopack

# Building & Type Checking
pnpm build               # Build for production
pnpm type-check          # Run TypeScript type checking without emitting

# Testing
pnpm test                # Run Jest tests (passes with no tests)
pnpm test:watch          # Run Jest in watch mode

# Linting
pnpm lint                # Run ESLint
pnpm lint:fix            # Run ESLint with auto-fix

# Other
pnpm start               # Start production server
```

### Monorepo Commands

From the root directory (`/Users/standardwish/Documents/Projects/frontend/`):

```bash
pnpm dev                 # Run all apps in dev mode
pnpm build               # Build all apps
pnpm lint                # Lint all packages
pnpm type-check          # Type check all packages
pnpm test                # Run all tests
pnpm format              # Format code with Prettier
pnpm commit              # Commit using Conventional Commits format
```

## Architecture

### Monorepo Structure

This app is part of a **Turborepo** monorepo with shared packages:

- **@repo/ui**: Shared React components (imported as `@ui/*`)
- **@repo/core**: Schemas, utilities, types (imported as `@core/*`)
- **@repo/assets**: Fonts, icons, static resources
- **@repo/eslint-config**: ESLint configuration
- **@repo/typescript-config**: TypeScript configuration
- **@repo/tailwind-config**: Tailwind CSS configuration
- **@repo/jest-presets**: Jest testing configuration

### Path Aliases

Configured in `tsconfig.json`:

- `@/*` → `./src/*` (local app code)
- `@ui/*` → `../../packages/ui/src/*` (shared UI components)
- `@core/*` → `../../packages/core/src/*` (shared core utilities)

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js API routes
│   │   └── calendar/      # Calendar API routes
│   ├── signin/            # Sign-in page
│   └── [...rest]/         # Catch-all route
├── calendar/              # Calendar feature module
│   ├── components/        # Calendar-specific components
│   │   ├── month-view/
│   │   ├── week-and-day-view/
│   │   ├── year-view/
│   │   ├── agenda-view/
│   │   ├── dnd/           # Drag-and-drop components
│   │   ├── dialogs/       # Event dialogs
│   │   └── header/        # Calendar header
│   ├── contexts/          # Calendar React contexts
│   ├── hooks/             # Calendar-specific hooks
│   ├── types.ts           # Calendar types
│   ├── schemas.ts         # Zod schemas
│   ├── requests.ts        # API requests
│   ├── helpers.ts         # Helper functions
│   └── mocks.ts           # Mock data
├── components/            # Shared app components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication feature
│   └── navigation/       # Navigation feature
├── hooks/                # Shared React hooks
├── lib/                  # Utility libraries
├── utils/                # Utility functions
├── constants/            # Constants
├── types/                # TypeScript type definitions
├── auth.ts               # NextAuth.js configuration
├── middleware.ts         # Next.js middleware for auth
└── env.ts                # Environment variable validation (t3-oss)
```

### Authentication Architecture

Uses **NextAuth.js 5.0.0-beta.28** with:

- **Provider**: Credentials provider (currently with mock user data)
- **Session Strategy**: JWT
- **Session Duration**: 30 days
- **Protected Routes**: Middleware in `src/middleware.ts` redirects unauthenticated users to `/signin`
- **Public Routes**: `/signin` (defined in `middleware.ts`)

**Important**:

- The middleware currently has `isLoggedIn = true` hardcoded (line 15 in `src/middleware.ts`)
- The auth configuration at `src/auth.ts` contains mock user data and commented-out DB logic
- Auth exports are re-exported from `src/auth.ts`: `handlers`, `auth`, `signIn`, `signOut`

### Environment Variables

Managed with **@t3-oss/env-core** in `src/env.ts`:

**Server-side:**

- `AUTH_SECRET`: NextAuth secret
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Google Calendar API
- `GOOGLE_PRIVATE_KEY`: Google Calendar API
- `GOOGLE_CALENDAR_ID`: Google Calendar API

**Client-side:**

- `NEXT_PUBLIC_SERVER_URL`: Backend API URL

All environment variables must be defined in `.env` file.

### UI Component Library

Uses **shadcn/ui** (New York style) with Radix UI primitives:

- Configuration in `components.json`
- Components located in `src/components/ui/`
- Uses Tailwind CSS with CSS variables for theming
- Icon library: **lucide-react**

Custom UI components from `@repo/ui`:

- Import from `@ui/components/client` (client components)
- Import from `@ui/components/server` (server components)

### Styling

- **Tailwind CSS v4** with custom configuration
- **CSS Variables**: Defined in `src/app/globals.css`
- **Font**: Pretendard GOV Variable (loaded from `@repo/assets`)
- Layout uses **Sidebar** component pattern with `SidebarProvider`

### Calendar Feature

The calendar is a complex feature module with:

- **Multiple view modes**: Month, Week, Day, Year, Agenda
- **Drag-and-drop**: Custom DnD implementation in `src/calendar/components/dnd/`
- **Context API**: Calendar state managed via `calendar-context.tsx`
- **Google Calendar Integration**: API routes and helpers for Google Calendar
- **Zod Schemas**: Input validation for calendar events

### Form Handling

Uses **react-hook-form** with:

- **@hookform/resolvers**: Zod integration
- **@hookform/error-message**: Error display helper

### Data Fetching

- **ky**: HTTP client for API requests
- **nuqs**: URL state management (wrapped with `NuqsAdapter` in layout)

### Testing

- **Jest** configured with `@repo/jest-presets`
- **MSW 2.10.5**: Mock Service Worker for API mocking
- Test command: `pnpm test` (currently passes with no tests)

## Development Workflow

### Package Manager

**CRITICAL**: This project MUST use **pnpm** (v10.10.0) as the package manager.

- **NEVER** use npm or yarn
- **ALWAYS** use pnpm for installing dependencies, running scripts, and managing packages
- The monorepo is configured with pnpm workspaces
- Using other package managers will cause dependency resolution issues

### Code Quality Checks

Before committing or submitting PRs, run the following checks:

```bash
# Required checks before committing
pnpm lint                # Check for linting errors
pnpm lint:fix            # Auto-fix linting issues
pnpm type-check          # Verify TypeScript types
pnpm test                # Run all tests

# Recommended workflow
pnpm lint:fix && pnpm type-check && pnpm test && pnpm build
```

**Linting is mandatory**:

- All code must pass ESLint checks before committing
- Use `pnpm lint:fix` to automatically fix issues
- Husky pre-commit hooks may enforce these checks
- Turborepo requires build completion before linting (`lint` depends on `^build`)

### Commit Guidelines

- Use `pnpm commit` for guided Conventional Commits format
- Commitlint validates commit messages
- Follow the commit format enforced by the project

## Important Notes

1. **Package Manager**: MUST use pnpm - never npm or yarn
2. **Port Configuration**: Dev server runs on port 3001, not 3000
3. **Monorepo Context**: Always consider impact on shared packages when making changes
4. **Build Output**: Configured for standalone output (`next.config.ts`)
5. **Turbopack**: Development uses Turbopack for faster builds
6. **React 19**: This project uses React 19, be aware of breaking changes
7. **Git Workflow**: Uses Conventional Commits with commitlint and husky hooks
8. **Mock Authentication**: Current auth implementation uses hardcoded values and needs real integration
9. **TypeScript Strict Mode**: Type checking is enforced; run `pnpm type-check` before committing
10. **Lint Verification**: All code must pass `pnpm lint` before committing

## Working with Shared Packages

When modifying code that depends on `@repo/ui` or `@repo/core`:

1. Changes to shared packages require rebuilding: `pnpm build` from monorepo root
2. Turborepo caches build outputs; use `turbo clean` if you encounter stale builds
3. Lint depends on build (`^build` in `turbo.json`), so build before linting

## Current State

Based on git status, the following areas have recent changes:

- Authentication (signin flow)
- Calendar API integration
- Component library additions (new UI components in `src/components/`)
- Environment configuration
- Middleware and auth configuration
