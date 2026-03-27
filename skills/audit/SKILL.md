---
name: audit
description: "Analyzes a backend codebase's practices to generate refactoring steps that teach them to new developers via onboarding. Tool for tech leads. Triggers: 'audit', 'architecture audit', 'analyze my code', 'architecture diagnosis', 'refactoring roadmap', '/audit'."
---

# Audit — Adapt onboarding to your codebase practices

This skill analyzes the practices and conventions already in place in a backend codebase, then generates refactoring steps that progressively teach them to a developer who doesn't master them yet. These steps feed Phase 6 of the `/onboarding` skill.

**This skill is for the tech lead**, not the developer being onboarded.

**This skill is agnostic**: it works on any backend language and framework.

---

## Bootstrap — Reading the configuration

**Step 1**: Read the configuration file:
- Path: `${CLAUDE_SKILL_DIR}/../../config.json`

Parse the JSON. This file determines:
- `language`: message language (`"fr"` by default)
- `audit.scan-paths`: directories to scan (default: `["src/"]`)
- `references`: where to find reference files (null = bundled, string path = project file)

**Step 2**: Reference resolution (same logic as the onboarding skill).

For each entry in `references.skills`:
- If the value is `null` → the bundled file is at `${CLAUDE_SKILL_DIR}/../../references/skills/{key}.md`
- If the value is a string path → read that file from the project

For each entry in `references.examples`:
- If the value is `null` → the bundled file is at `${CLAUDE_SKILL_DIR}/../../references/examples/{key}.ts`
  - Key to bundled filename mapping:
    - `testApp` → `testApp.ts`
    - `commandResult` → `commandResult.ts`
    - `dsl` → `createUserAccount.dsl.ts`
    - `e2eDriver` → `createUserAccount.e2eDriver.ts`
    - `e2eSpec` → `createUserAccount.e2e-spec.ts`
    - `useCase` → `createUserAccount.useCase.ts`
    - `controller` → `createUserAccount.controller.ts`
    - `entity` → `userAccount.entity.ts`
    - `valueObject` → `userAcountEmail.vo.ts`
    - `inMemoryRepository` → `createUserAccount.inMemoryRepository.ts`
    - `useCaseDriver` → `createUserAccount.useCaseDriver.ts`
- If the value is a string path → read that file from the project

---

## Phase execution

Phases are executed **in order**, without exception. Read each phase file and follow its instructions.

| Phase | File | Description |
|-------|------|-------------|
| 1. Analysis | `${CLAUDE_SKILL_DIR}/../../phases/audit/00-analysis-guide.md` | Identify existing practices and propose refactoring steps to teach them |
| 2. Generation | `${CLAUDE_SKILL_DIR}/../../phases/audit/01-generation.md` | Generate proposal files and update config |

All phase file paths are relative to `${CLAUDE_SKILL_DIR}/../../`.

---

## Strict rules

1. **NEVER generate proposals without tech lead validation** — always present the proposed steps and wait for validation before generating files
2. **NEVER propose a practice absent from the codebase** — if no existing file illustrates the practice, it must not become a step. Only the tech lead can add aspirational practices
3. **Adapt detection to the detected language/framework** — do not assume TypeScript or NestJS
4. **Generated proposals must follow the existing format exactly** — to be compatible with the onboarding skill
5. **Everything in English by default** — unless `config.language` is `"fr"`
6. **Order pedagogically** — from simplest to most advanced practices. Each step must be understandable independently
7. **Reference existing code** — each step must cite concrete codebase files that already illustrate the practice being taught
8. **Respect the tech lead's decisions** — if they remove, reorder, or add steps, apply without resistance
