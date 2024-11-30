# Personal Website

Este proyecto es un sitio web personal construido con tecnologías modernas y configurado para ser desplegado usando Docker y Github Pages con CI/CD de GithubActions

## 🚀 Tecnologías

- [Astro](https://astro.build/) - Framework web para sitios estáticos
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS utilitario
- [PNPM](https://pnpm.io/) - Gestor de paquetes rápido y eficiente
- [Docker](https://www.docker.com/) - Contenedorización
- [Nginx](https://nginx.org/) - Servidor web de alto rendimiento

## 📁 Estructura del Proyecto

```
web-personal/
├── nginx/                  # Configuración de Nginx
│   └── nginx.conf         # Archivo de configuración principal de Nginx
├── public/                # Archivos estáticos
├── src/                   # Código fuente
├── astro.config.mjs       # Configuración de Astro
├── docker-compose.yaml    # Configuración de Docker Compose
├── Dockerfile            # Instrucciones de construcción de Docker
├── package.json          # Dependencias y scripts
├── pnpm-lock.yaml       # Lock file de PNPM
├── tailwind.config.mjs   # Configuración de Tailwind CSS
└── tsconfig.json        # Configuración de TypeScript
```

## 🐳 Configuración Docker

El proyecto utiliza un enfoque multi-stage build para optimizar el tamaño de la imagen final y mejorar la seguridad.

### Dockerfile

```dockerfile
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
```

El Dockerfile está configurado en dos etapas:
1. **Build Stage**: 
   - Utiliza Node.js Alpine como base
   - Instala y configura PNPM para gestión de dependencias
   - Construye la aplicación de Astro
2. **Runtime Stage**: 
   - Utiliza Nginx Alpine para un contenedor ligero
   - Copia los archivos estáticos generados
   - Configura Nginx con configuración personalizada

### Docker Compose

```yaml
### Service Web Personal ####
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: web-personal
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
```

El archivo `docker-compose.yaml` incluye:
- Construcción automática del contenedor
- Mapeo del puerto 80
- Reinicio automático del contenedor
- Variables de entorno para producción
- Healthcheck para monitoreo de la salud del servicio

## 🔄 CI/CD con GitHub Actions

El proyecto utiliza GitHub Actions para automatizar el despliegue a GitHub Pages cada vez que se realizan cambios en la rama principal.

### Flujo de Trabajo de Despliegue

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v4
      - name: Install, build, and upload your site
        uses: withastro/action@v3
        with:
          node-version: 20
          package-manager: pnpm@latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Características del Despliegue Automático

- **Trigger Automático**: Se activa con cada push a la rama `main`
- **Trigger Manual**: Puede ser ejecutado manualmente desde la pestaña Actions
- **Optimizado para Astro**: Utiliza la acción oficial de Astro para el build
- **Configuración Específica**:
  - Node.js v20
  - PNPM como gestor de paquetes
  - Despliegue automático a GitHub Pages

### Flujo de Desarrollo y Despliegue

1. Los cambios se pushean a la rama `main`
2. GitHub Actions automáticamente:
   - Clona el repositorio
   - Instala las dependencias con PNPM
   - Construye el sitio con Astro
   - Despliega a GitHub Pages
3. El sitio se actualiza automáticamente en la URL de GitHub Pages

## 🛠️ Desarrollo Local

### Requisitos Previos

- Docker
- Docker Compose
- PNPM (opcional, solo para desarrollo sin Docker)

### Levantar el Proyecto con Docker Compose

1. Clonar el repositorio:
```bash
git clone https://github.com/kobogithub/web-personal.git
cd web-personal
```

2. Construir y levantar los contenedores:
```bash
docker-compose up --build
```

3. Acceder a la aplicación:
- Abrir el navegador en `http://localhost`

### Desarrollo sin Docker

1. Instalar PNPM (si no está instalado):
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Iniciar el servidor de desarrollo:
```bash
pnpm run dev
```

## 📝 Nginx

La incorporación de Nginx como servidor web en producción proporciona:

- **Rendimiento Optimizado**: Servidor ligero y eficiente para contenido estático
- **Configuración Personalizada**: Configuración específica en `nginx/nginx.conf`
- **Seguridad**: Basado en Alpine para minimizar la superficie de ataque
- **Alta Disponibilidad**: Configurado con healthchecks para monitoreo continuo

La configuración está optimizada para servir una aplicación web estática construida con Astro de manera eficiente y segura.
