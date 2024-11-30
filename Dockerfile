# Build stage con Node-Alpine
FROM node:lts-alpine AS build

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY pnpm-lock.yaml package.json ./

# Instalar dependencias (más rápido que npm)
RUN pnpm install --frozen-lockfile

# Copiar codigo fuente
COPY . .

# Build del codigo fuente
RUN pnpm run build

# Runtime stage Nginx
FROM nginx:alpine AS runtime

# Copiar configuracion de Nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar codigo fuente al repositorio HTML de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposicion del puerto 80
EXPOSE 80
