# Dockerfile.dev para entorno de desarrollo Astro
FROM node:18-alpine

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración primero
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Exponer el puerto de desarrollo de Astro
EXPOSE 4321

# Comando por defecto: modo desarrollo
CMD ["npx", "astro", "dev", "--host"]