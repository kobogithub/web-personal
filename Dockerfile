# Build stage
FROM node:18-alpine AS build

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración primero
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias incluyendo astro-icon
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Build del código fuente
RUN pnpm run build

# Runtime stage Nginx
FROM nginx:alpine AS runtime

# Copiar configuración de Nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar código fuente al repositorio HTML de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposicion del puerto 80
EXPOSE 80