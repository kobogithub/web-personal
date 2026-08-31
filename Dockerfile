# Dockerfile de desarrollo para Astro
FROM node:22-alpine

# pnpm vía corepack, con la versión que fija packageManager en package.json
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /app

# Primero lo que define las dependencias, para aprovechar la cache de capas
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Puerto de desarrollo de Astro
EXPOSE 4321

CMD ["pnpm", "dev", "--host"]
