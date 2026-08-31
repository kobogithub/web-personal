---
title: 'Knowledge Framework (kn)'
slug: 'knowledge-framework-en'
summary: 'A Rust CLI that solves the cold start problem in AI-assisted development: it leaves a project ready to work with agents in seconds, instead of an afternoon of manual setup.'
role: 'Author and maintainer'
period: '2026 — present'
status: 'active'
stack: ['Rust', 'clap', 'reqwest', 'serde', 'TOML', 'Spec Kit', 'MCP']
tags: ['Rust', 'AI', 'CLI', 'MCP', 'Open Source']
repoUrl: 'https://github.com/kobogithub/knowledge'
lang: 'en'
alternate: 'knowledge-framework'
order: 1
---

## The problem

Every time you start a new project with AI agents, you repeat the same ritual: define roles and workflows, set up issue tracking, install the skills the project will need, bring up MCP servers so agents have documentation at hand, and create planning templates.

That's half a day of work that adds nothing to the product, and it gets done slightly differently each time. The result is that every repository ends up with its own conventions, and what you learned in one doesn't carry over to the next.

That is the **cold start problem** of AI-assisted development: the fixed startup cost is high enough to discourage using agents on small projects, which is exactly where they pay off most.

## The solution

`kn` is a CLI that automates that startup. One command leaves the project with agents, skills, memory, issue templates and MCP servers configured, following a single convention.

```bash
kn init my-project --stack rust
```

The central design decision is that **the framework holds no opinion about which model you use**. Agents are declared in Markdown with YAML frontmatter; the CLI installs and wires them, but couples to no provider. That lets you move a project between assistants without rewriting its configuration.

## Architecture

The CLI is written in Rust and organized per command, each in its own module:

```
cli/src/
├── main.rs
└── commands/
    ├── init.rs      # project initialization
    ├── skills.rs    # skills management
    ├── agents.rs    # agent management
    ├── beads.rs     # issue templates
    ├── mcp.rs       # MCP servers
    ├── doctor.rs    # dependency verification
    ├── sync.rs      # project sync
    └── update.rs    # self-update
```

Around the binary live the artifacts it installs:

- **9 specialized agents** — planner, frontend, backend, rust, devops, qa, security, uiux-tester and finance. Each is an `AGENTS.md` with its responsibilities and boundaries.
- **21 skills** — from per-language best practices (Rust, Python, Bash) to security (Semgrep, Trivy, Gitleaks, OWASP ZAP).
- **Workflow templates** — formulas for feature, bugfix, spike and release.

Project configuration lives in a `kn.toml`, and skills are Markdown with YAML frontmatter: readable, versionable formats you can edit by hand.

## Spec-first governance

The framework enforces a working cycle taken from [Spec Kit](https://github.com/github/spec-kit): **analyze → plan → specify → execute → verify → document**. Each feature lives in `specs/NNN-name/` with its spec, plan and tasks.

The rule is that nothing gets implemented without an approved spec. It sounds bureaucratic for a personal project, but with agents it changes the outcome noticeably: the model works far better against a document that pins down scope than against a loose prompt, and the spec remains as a record of why things were done the way they were.

## Distribution

`kn` ships via **Homebrew, `.deb` and `.rpm`**, with cross-platform installers and automated publishing on each release.

That turned out to be the most laborious part of the project and the worst documented on the web: setting up a Homebrew tap, packaging for Debian, writing the RPM `.spec` and automating the full release involves a lot of scattered detail and very little end-to-end guidance.

## Status

The core, enhancement and multi-agent workflow phases are complete. The project is open source under the MIT license and remains in active development.
