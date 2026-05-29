FROM node:24-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY packages packages
RUN corepack enable && pnpm install --frozen-lockfile=false
COPY apps/api apps/api
CMD ["pnpm", "--filter", "@crm/api", "dev"]

