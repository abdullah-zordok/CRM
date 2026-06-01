FROM node:24-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json apps/web/package.json
COPY packages packages
RUN corepack enable && pnpm install --frozen-lockfile=false
COPY apps/web apps/web
CMD ["pnpm", "--filter", "@crm/web", "dev"]
