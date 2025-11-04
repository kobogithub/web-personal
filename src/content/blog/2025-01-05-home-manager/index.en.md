---
title: "Home Manager"
slug: "home-manager-en"
description: "Shell environment manager"
tags: ["ZSH"]
pubDate: "Jan 05 2025"
coverImage: "./home-manager.jpg"
lang: 'en'
alternate: 'home-manager'
---

# Managing Dotfiles with Nix and Home Manager: A Complete Guide

In this post, I'll share my personal configuration for managing dotfiles using Nix and Home Manager. This solution provides a declarative and reproducible way to maintain your Linux system configuration, enabling easy synchronization across different machines and efficient version control.

## Why Nix and Home Manager?

Nix is a purely functional package manager that offers several advantages:

- **Reproducibility**: Configurations are identical on any machine
- **Declarative**: You describe the desired state, not the steps to get there
- **Rollbacks**: You can easily revert changes
- **Isolation**: Configurations don't interfere with each other

Home Manager, built on top of Nix, allows us to manage user environment configuration declaratively.

## Repository Structure

My configuration is organized as follows:

```
dotfiles/
├── install.sh              # Installation script
├── home-manager/
│   ├── home.nix           # Main configuration
│   └── modules/           # Configuration modules
│       ├── astro.nix      # AstroVim
│       ├── aws.nix        # AWS CLI
│       ├── docker.nix     # Docker
│       ├── git.nix        # Git
│       ├── tmux.nix       # Tmux
│       └── zsh.nix        # ZSH
```

## Installation Script

The `install.sh` script automates the initial setup:

```bash
#!/bin/bash
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Utility functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# ... [rest of the script]
```

The script performs the following tasks:

1. Verifies it's not running as root
2. Installs Nix if not present
3. Installs Home Manager
4. Clones or updates the dotfiles repository
5. Configures necessary symbolic links
6. Applies the configuration

## Main Configuration (home.nix)

The `home.nix` file is the main entry point:

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
      # Basic tools
      curl wget btop ripgrep
      neofetch fd tree ncdu
      # Development
      gcc gnumake cargo rustc
      # Kubernetes
      kubernetes-helm k9s kubectx
      kubectl kustomize
      # Others
      duckdb inetutils
    ];
  };

  programs.home-manager.enable = true;
}
```

## Main Modules

### AstroVim (astro.nix)

- Neovim configuration with AstroVim
- Preloaded plugins and configurations
- LSP and autocompletion support

### AWS (aws.nix)

- AWS CLI configuration
- Integration with aws-vault
- Useful aliases for common operations

### Docker (docker.nix)

- Basic Docker configuration
- Aliases and development tools
- Container integration

### Git (git.nix)

- Global configuration
- Common aliases
- Integration with LazyGit
- Git LFS support

### Tmux (tmux.nix)

- Modern configuration
- Popular plugins
- Themes and customization
- Intuitive keybindings

### ZSH (zsh.nix)

- Powerlevel10k
- Useful plugins
- Custom aliases
- Integration with development tools

## Package Management

The configuration includes a wide selection of packages:

1. **Basic tools**:

   - `curl` and `wget` for data transfer
   - `btop` for system monitoring
   - `ripgrep` and `fd` for efficient searching
   - `tree` and `ncdu` for directory visualization

2. **Development**:

   - Rust (`cargo`, `rustc`, `rust-analyzer`)
   - C/C++ (`gcc`, `gnumake`)
   - Node.js (`pnpm`)

3. **Kubernetes**:

   - `kubectl`, `helm`, `k9s`
   - `kubectx` and `kustomize`

4. **Databases and utilities**:
   - `duckdb` for OLAP analysis
   - `inetutils` for communications

## Installation and Usage

1. Clone the repository:

```bash
git clone https://github.com/kobogithub/dotfiles-home-manager.git
cd dotfiles-home-manager
```

2. Run the installation script:

```bash
chmod +x install.sh
./install.sh
```

3. Verify the installation:

```bash
home-manager --version
```

## Updates

To keep your configuration up to date:

```bash
cd ~/dotfiles
git pull
home-manager switch
```

## Conclusion

This configuration provides a robust and reproducible development environment. The combination of Nix and Home Manager makes managing dotfiles easy and ensures your environment is consistent across all your machines.

The complete code is available on [GitHub](https://github.com/kobogithub/dotfiles-home-manager). Feel free to fork it and adapt it to your needs!
