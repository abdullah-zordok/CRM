FROM node:24-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml .npmrc ./
COPY pnpm-lock.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages packages
RUN corepack enable && pnpm install --frozen-lockfile
COPY apps/api apps/api
CMD ["sh", "-c", "pnpm --filter @crm/api db:migrate && pnpm --filter @crm/api db:seed && pnpm --filter @crm/api dev"]
