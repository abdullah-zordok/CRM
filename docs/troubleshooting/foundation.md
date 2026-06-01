# Foundation Troubleshooting

## Docker

Run `docker compose up -d postgres redis` before API integration checks.

## Database

Verify `DATABASE_URL` points to the local PostgreSQL service and run
`pnpm db:migrate` before `pnpm db:seed`.

## Redis

Verify `REDIS_URL` points to the local Redis service. Queue readiness depends on
Redis health.

## Seeded Admin

Set `SEEDED_ADMIN_EMAIL` and `SEEDED_ADMIN_PASSWORD` in `apps/api/.env`, then run
`pnpm db:seed`.

## Verification

Run `pnpm verify:foundation` after the web and API apps are started.
