FROM node:22.15-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune web --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the project

COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching

# ARG TURBO_TEAM

# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN

# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN npm run build

FROM base AS runner
WORKDIR /app

# Don't run production as root

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size

# https://nextjs.org/docs/advanced-features/output-file-tracing

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node","--trace-deprecation","apps/web/server.js"]