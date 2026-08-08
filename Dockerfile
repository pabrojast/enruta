FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.16.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Migraciones Drizzle: se corre como Job de k8s (con 2+ réplicas dos migrate
# concurrentes en el CMD se pisarían; la imagen standalone no lleva drizzle/).
FROM deps AS migrator
COPY drizzle.config.ts tsconfig.json ./
COPY drizzle ./drizzle
COPY src/db ./src/db
COPY src/lib ./src/lib
COPY src/data ./src/data
COPY scripts ./scripts
CMD ["pnpm", "db:migrate"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# DSN dummy solo para que `next build` evalúe módulos que exigen DATABASE_URL;
# postgres.js no conecta hasta la primera query.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
