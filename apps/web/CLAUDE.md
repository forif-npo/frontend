# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **web** app within the FORIF Frontend monorepo - a member and mentor homepage for FORIF (한양대학교 중앙 개발 동아리). It's built with Next.js 15.4.2, React 19, and uses the App Router architecture.

The monorepo is located at `/Users/standardwish/Documents/Projects/frontend/` and contains:

- **apps/web**: This member/mentor homepage (current location)
- **apps/admin**: Operator management system
- **packages**: Shared packages (`@repo/ui`, `@repo/core`, `@repo/assets`, etc.)

## Development Commands

This project uses **pnpm** as the package manager. The development server runs on **port 3000** (default).

```bash
# Development
pnpm dev                  # Start dev server on http://localhost:3000 with Turbopack

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
- **@repo/core**: Schemas, utilities, types, API functions (imported as `@core/*`)
- **@repo/assets**: Fonts, icons, static resources
- **@repo/eslint-config**: ESLint configuration
- **@repo/typescript-config**: TypeScript configuration
- **@repo/tailwind-config**: Tailwind CSS configuration
- **@repo/jest-presets**: Jest testing configuration

### Path Aliases

Configured in `tsconfig.json`:

- `@/*` → `./src/*` (local app code)
- `@ui/*` → `../../packages/ui/src/*` (shared UI components)
- `@core/*` → `../../packages/core/src/*` (shared core utilities and APIs)

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Auth callback routes
│   │   └── callback/      # OAuth callback handler
│   ├── signin/            # Sign-in page
│   ├── signup/            # Sign-up page and completion
│   │   └── complete/      # Sign-up completion page
│   ├── my/                # User profile/dashboard
│   └── [...rest]/         # Catch-all route
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   └── navigation/        # Navigation feature
├── components/            # Shared app components
├── mocks/                 # MSW mock handlers
│   └── apis/              # API mock definitions
├── providers/             # React context providers
├── hooks/                 # Shared React hooks
├── utils/                 # Utility functions
├── constants/             # Constants
├── types/                 # TypeScript type definitions
├── auth.ts                # NextAuth.js configuration
├── middleware.ts          # Next.js middleware for auth
└── env.ts                 # Environment variable validation (t3-oss)
```

### Authentication Architecture

Uses **NextAuth.js 5.0.0-beta.28** with **dual authentication providers**:

#### 1. Google OAuth Provider

- **Purpose**: Primary authentication for members with Hanyang University emails
- **Email validation**: Only `@hanyang.ac.kr` emails are allowed
- **Flow**:
  1. User signs in with Google
  2. Middleware validates `@hanyang.ac.kr` email
  3. Backend API (`userLogin` from `@core/auth/api`) exchanges Google access token for backend JWT
  4. If user not found (404), redirect to `/signup`
  5. Backend JWT stored in session as `accessToken`

#### 2. Staff Credentials Provider

- **Purpose**: Alternative authentication for staff/operators using student ID and password
- **Credentials**: `userId` (student ID as number), `password`
- **Flow**:
  1. User submits student ID and password
  2. Backend API (`staffLogin` from `@core/auth/api`) validates credentials
  3. Backend JWT stored in session as `accessToken`

**Session Configuration**:

- **Strategy**: JWT
- **Duration**: 1 hour (`maxAge: 60 * 60`)
- **Session fields**:
  - `accessToken`: Backend JWT token
  - `role`: User role from backend
  - `provider`: Either "google" or "staff-credentials"
  - `isSignUp`: Boolean indicating if user completed registration

**Middleware Protection** (`src/middleware.ts`):

- **Protected routes**: Everything except public routes
- **Public routes**: `/`, `/signin`, `/signup`, `/terms`, `/privacy-policy`, `/signup/complete`
- **Auth routes**: `/signin` (redirects to `/` if already logged in)
- **Authentication check**: `isLoggedIn = !!req.auth && req.auth.isSignUp`
  - User must have both auth session AND completed signup

**Important Implementation Details**:

- Uses **dynamic imports** for Edge Runtime compatibility (`await import("@core/auth/api")`)
- Backend JWT is stored as `backendJwt` in token, exposed as `accessToken` in session
- Google access token also stored for reference (`googleAccessToken`)
- Session update mechanism via `trigger === "update"` for token refresh

### Environment Variables

Managed with **@t3-oss/env-core** in `src/env.ts`:

**Server-side:**

- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `AUTH_SECRET`: NextAuth secret key

**Client-side:**

- `NEXT_PUBLIC_SERVER_URL`: Backend API base URL

All environment variables must be defined in `.env` file.

### UI Component Library

Uses custom components from `@repo/ui`:

- Import from `@ui/components/client` (client components)
- Import from `@ui/components/server` (server components)

Also includes local components in `src/components/` for web-specific UI.

### Styling

- **Tailwind CSS v4** with custom configuration
- **CSS Variables**: Defined in `src/app/globals.css`
- **Font**: Pretendard GOV Variable (loaded from `@repo/assets`)

### Form Handling

Uses **react-hook-form** with:

- **@hookform/resolvers**: Zod integration
- **@hookform/error-message**: Error display helper

### Data Fetching

- **ky**: HTTP client for API requests
- **@core/auth/api**: Shared API functions for authentication (`userLogin`, `staffLogin`)
- **nuqs**: URL state management (wrapped with `NuqsAdapter` in layout if needed)

### Testing & Mocking

- **Jest** configured with `@repo/jest-presets`
- **MSW 2.10.5**: Mock Service Worker for API mocking
  - Worker directory: `public/`
  - Mock handlers in `src/mocks/apis/`
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
2. **Port Configuration**: Dev server runs on port 3000 (default)
3. **Monorepo Context**: Always consider impact on shared packages when making changes
4. **Turbopack**: Development uses Turbopack for faster builds
5. **React 19**: This project uses React 19, be aware of breaking changes
6. **Git Workflow**: Uses Conventional Commits with commitlint and husky hooks
7. **TypeScript Strict Mode**: Type checking is enforced; run `pnpm type-check` before committing
8. **Lint Verification**: All code must pass `pnpm lint` before committing

### Authentication-Specific Notes

9. **Dual Auth System**: Supports both Google OAuth and Staff Credentials
10. **Email Restriction**: Only `@hanyang.ac.kr` emails allowed for Google OAuth
11. **Backend API Integration**: Authentication requires backend API (`@core/auth/api`)
12. **Edge Runtime Compatibility**: Auth code uses dynamic imports for Edge Runtime
13. **Session Duration**: 1 hour JWT sessions (shorter than admin app's 30 days)
14. **Signup Flow**: New Google users (404 from backend) redirected to `/signup`
15. **Access Token**: Backend JWT exposed as `session.accessToken` for API calls

## Working with Shared Packages

When modifying code that depends on `@repo/ui` or `@repo/core`:

1. Changes to shared packages require rebuilding: `pnpm build` from monorepo root
2. Turborepo caches build outputs; use `turbo clean` if you encounter stale builds
3. Lint depends on build (`^build` in `turbo.json`), so build before linting

### Using @core/auth/api

The authentication logic relies on `@core/auth/api` functions:

```typescript
import { userLogin, staffLogin } from "@core/auth/api";

// Google OAuth flow
const response = await userLogin({ accessToken: googleAccessToken });

// Staff credentials flow
const response = await staffLogin({ userId: number, password: string });
```

Both return `{ data: { accessToken: string, role: string } }` on success.

## User Flows

### Google OAuth Sign-in Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent
3. Google redirects back to `/api/auth/callback/google`
4. Backend validates `@hanyang.ac.kr` email
5. If registered: Session created with backend JWT → redirect to `/`
6. If not registered (404): Redirect to `/signup` with Google profile data
7. User completes signup → redirect to `/signup/complete` → redirect to `/`

### Staff Sign-in Flow

1. User enters student ID and password on `/signin`
2. Form submits to NextAuth credentials provider
3. Backend validates credentials via `staffLogin`
4. Session created with backend JWT → redirect to `/`

### Protected Page Access

1. User visits protected page
2. Middleware checks `req.auth && req.auth.isSignUp`
3. If not authenticated: Redirect to `/signin`
4. If authenticated but not signed up: Redirect to `/signup`
5. Otherwise: Allow access
