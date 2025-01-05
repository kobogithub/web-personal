---
title: "Home Manager"
slug: "home-manager"
description: "Gestor de entorno para shell"
tags: ["ZSH"]
pubDate: "Jan 05 2025"
coverImage: "./home-manager.jpg"
---

# Gestión de Dotfiles con Nix y Home Manager: Una Guía Completa

En este post, compartiré mi configuración personal para gestionar dotfiles utilizando Nix y Home Manager. Esta solución proporciona una forma declarativa y reproducible de mantener la configuración de tu sistema Linux, permitiendo una fácil sincronización entre diferentes máquinas y un control de versiones eficiente.

## ¿Por qué Nix y Home Manager?

Nix es un gestor de paquetes puramente funcional que ofrece varias ventajas:

- **Reproducibilidad**: Las configuraciones son idénticas en cualquier máquina
- **Declarativo**: Describes el estado deseado, no los pasos para llegar a él
- **Rollbacks**: Puedes revertir cambios fácilmente
- **Aislamiento**: Las configuraciones no interfieren entre sí

Home Manager, construido sobre Nix, nos permite gestionar la configuración del entorno de usuario de manera declarativa.

## Estructura del Repositorio

Mi configuración está organizada de la siguiente manera:

```
dotfiles/
├── install.sh              # Script de instalación
├── home-manager/
│   ├── home.nix           # Configuración principal
│   └── modules/           # Módulos de configuración
│       ├── astro.nix      # AstroVim
│       ├── aws.nix        # AWS CLI
│       ├── docker.nix     # Docker
│       ├── git.nix        # Git
│       ├── tmux.nix       # Tmux
│       └── zsh.nix        # ZSH
```

## Script de Instalación

El script `install.sh` automatiza la configuración inicial:

```bash
#!/bin/bash
# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funciones de utilidad
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# ... [resto del script]
```

El script realiza las siguientes tareas:

1. Verifica que no se ejecute como root
2. Instala Nix si no está presente
3. Instala Home Manager
4. Clona o actualiza el repositorio de dotfiles
5. Configura los enlaces simbólicos necesarios
6. Aplica la configuración

## Configuración Principal (home.nix)

El archivo `home.nix` es el punto de entrada principal:

```nix
{ config, pkgs, ... }:
{
  imports = [
    ./modules/git.nix
    ./modules/zsh.nix
    ./modules/docker.nix
    ./modules/aws.nix
    ./modules/tmux.nix
    ./modules/astro.nix
  ];

  home = {
    username = "kobo";
    homeDirectory = "/home/kobo";
    stateVersion = "23.11";
    packages = with pkgs; [
      # Herramientas básicas
      curl wget btop ripgrep
      neofetch fd tree ncdu
      # Desarrollo
      gcc gnumake cargo rustc
      # Kubernetes
      kubernetes-helm k9s kubectx
      kubectl kustomize
      # Otros
      duckdb inetutils
    ];
  };

  programs.home-manager.enable = true;
}
```

## Módulos Principales

### AstroVim (astro.nix)

- Configuración de Neovim con AstroVim
- Plugins y configuraciones precargadas
- Soporte para LSP y autocompletado

### AWS (aws.nix)

- Configuración de AWS CLI
- Integración con aws-vault
- Aliases útiles para operaciones comunes

### Docker (docker.nix)

- Configuración básica de Docker
- Aliases y herramientas de desarrollo
- Integración con contenedores

### Git (git.nix)

- Configuración global
- Aliases comunes
- Integración con LazyGit
- Soporte para Git LFS

### Tmux (tmux.nix)

- Configuración moderna
- Plugins populares
- Temas y personalización
- Keybindings intuitivos

### ZSH (zsh.nix)

- Powerlevel10k
- Plugins útiles
- Aliases personalizados
- Integración con herramientas de desarrollo

## Gestión de Paquetes

La configuración incluye una amplia selección de paquetes:

1. **Herramientas básicas**:

   - `curl` y `wget` para transferencia de datos
   - `btop` para monitoreo del sistema
   - `ripgrep` y `fd` para búsqueda eficiente
   - `tree` y `ncdu` para visualización de directorios

2. **Desarrollo**:

   - Rust (`cargo`, `rustc`, `rust-analyzer`)
   - C/C++ (`gcc`, `gnumake`)
   - Node.js (`pnpm`)

3. **Kubernetes**:

   - `kubectl`, `helm`, `k9s`
   - `kubectx` y `kustomize`

4. **Bases de datos y utilidades**:
   - `duckdb` para análisis OLAP
   - `inetutils` para comunicaciones

## Instalación y Uso

1. Clona el repositorio:

```bash
git clone https://github.com/kobogithub/dotfiles-home-manager.git
cd dotfiles-home-manager
```

2. Ejecuta el script de instalación:

```bash
chmod +x install.sh
./install.sh
```

3. Verifica la instalación:

```bash
home-manager --version
```

## Actualizaciones

Para mantener tu configuración al día:

```bash
cd ~/dotfiles
git pull
home-manager switch
```

## Conclusión

Esta configuración proporciona un entorno de desarrollo robusto y reproducible. La combinación de Nix y Home Manager facilita la gestión de dotfiles y asegura que tu entorno sea consistente en todas tus máquinas.

El código completo está disponible en [GitHub](https://github.com/kobogithub/dotfiles-home-manager). ¡No dudes en hacer fork y adaptarlo a tus necesidades!
