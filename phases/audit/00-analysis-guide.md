# Phase 1: Existing practices analysis

The objective is to identify the practices, patterns, and conventions already in place in the codebase, then propose refactoring steps that progressively teach them to a developer who doesn't master them yet.

**We're not looking for what's missing. We're looking for what exists to teach it.**

---

## Section 1: Environment detection

Before any analysis, identify the project's technical ecosystem.

### Instructions

1. **List the project root**: `ls` on the target project's root folder (not the plugin)
2. **Detect the language and framework** by reading configuration files:

| File | Indicates |
|------|-----------|
| `package.json` | Node.js / TypeScript — read `dependencies` for the framework (NestJS, Express, Fastify, Koa...) |
| `tsconfig.json` | TypeScript confirmed |
| `pom.xml` | Java / Maven — look for Spring Boot, Quarkus, Micronaut in dependencies |
| `build.gradle` / `build.gradle.kts` | Java/Kotlin / Gradle |
| `go.mod` | Go — look for the framework (Gin, Echo, Fiber, Chi...) |
| `requirements.txt` / `pyproject.toml` / `Pipfile` | Python — look for Django, Flask, FastAPI |
| `*.csproj` / `*.sln` | C# / .NET — look for ASP.NET Core |
| `Cargo.toml` | Rust — look for Actix, Axum, Rocket |
| `Gemfile` | Ruby — look for Rails, Sinatra |

3. **Detect the ORM / data access**:
   - TypeScript: TypeORM, Prisma, Sequelize, Knex, Drizzle, MikroORM
   - Java: Hibernate, JPA, MyBatis, jOOQ
   - C#: Entity Framework, Dapper, NHibernate
   - Go: GORM, sqlx, ent
   - Python: SQLAlchemy, Django ORM, Tortoise

4. **Detect the test framework**:
   - TypeScript: Vitest, Jest, Mocha
   - Java: JUnit, TestNG, Spock
   - C#: xUnit, NUnit, MSTest
   - Go: testing (builtin), testify
   - Python: pytest, unittest

5. **Identify the folder structure**: list folders under the main source path (`src/`, `app/`, `lib/`, `internal/`, `cmd/`...)

Present a summary:
> **Detected environment**: {language} / {framework} / {ORM} / {test framework}
> **Source structure**: {main path} with {brief description}

---

## Section 2: Identifying existing practices

Scan the codebase to spot **the practices and conventions the team already uses and applies consistently**. Only list what is actually in place — not what is absent, incomplete, or "to do".

**Rule**: a practice is only retained if it is illustrated by **at least one existing file** that applies it correctly. "Entities don't have factory methods" is NOT a practice — it's an absence. Do not list it.

### What to look for

For each category below, inspect the codebase and note **only** the practices actually found, with concrete examples (file names, code excerpts).

#### Code organization
- How are folders structured? (by feature, by technical layer, by domain?)
- How are files named? (naming conventions)
- Is there a controller / service / repository separation?
- Are there modules / bounded contexts / packages?

#### Code patterns
- How are entities/models built? (public constructors, factory methods, builders?)
- How is business logic organized? (in services, in entities, in use cases?)
- How are errors handled? (exceptions, result types, error codes?)
- How are validations done? (in controllers, in entities, with value objects, with DTOs?)
- How are dependencies injected? (constructor, DI framework, direct imports?)

#### Test patterns
- What types of tests exist? (E2E, integration, unit?)
- How are tests structured? (DSL/Driver, arrange/act/assert, given/when/then?)
- How are dependencies replaced in tests? (mocks, stubs, in-memory implementations?)
- Is there shared test infrastructure? (TestApp, fixtures, helpers?)

#### Data access
- How are reads done? (ORM, raw SQL, query builders?)
- How are writes done? (via repository, via direct ORM, via use case?)
- Are there interfaces/ports for repositories?

#### Other conventions
- Any other notable practice or convention specific to this codebase

**Important**: if a category has no actual practice (e.g., no tests exist), list nothing for that category. Do not write "No existing tests" — that's an absence, not a practice.

---

## Section 3: Building refactoring steps

From the identified practices, build steps that teach them to a new developer.

### Absolute rule

**Only propose practices that already exist in the codebase.** If a practice is not illustrated by at least one existing file in the project, it must NOT become a refactoring step.

Examples of violations to NEVER commit:
- The codebase has no Value Objects → do NOT propose introducing Value Objects
- The codebase has no CommandResult → do NOT propose introducing a CommandResult
- Entities don't have factory methods → do NOT propose encapsulating entities
- There are no tests → do NOT propose writing tests

The tech lead can add aspirational practices if they wish — but the skill must NEVER invent them itself.

### Principle

Each refactoring step corresponds to **a practice already applied in the codebase** that the developer needs to learn. The step guides them to apply that same practice to the code they just wrote during onboarding (phases 1-5).

### Algorithm

1. **Filter**: only keep practices identified in section 2 that are **actually illustrated by existing code** in the codebase. Discard anything absent, partial, or "to do"
2. **Order pedagogically**: from simplest and most fundamental to most advanced
   - Structure/organization practices first (easy to observe)
   - Code patterns next (entities, errors, validations)
   - Test practices last (require understanding the rest)
3. **Formulate each practice as a refactoring step**: "here's how we do it in this project, apply it to your code"
4. **Cite existing examples** for each step: codebase files that illustrate the practice

### For each step, prepare:
- **Short title** (e.g., "Organize code in vertical slices", "Separate reads with a SQL repository")
- **The practice being taught**: which codebase convention/pattern the dev will learn
- **Existing examples**: 1-3 codebase files that **already** illustrate this practice (not files "to refactor")
- **What the dev will need to do**: apply this practice to the code written during the previous onboarding phases

---

## Section 4: Presentation to the tech lead

Present the results in this format:

```
=== Identified practices ===

Detected environment: {language} / {framework} / {ORM} / {test framework}

Here are the practices and conventions I identified in your codebase:

1. {practice} — e.g.: {concrete file(s)}
2. {practice} — e.g.: {concrete file(s)}
...

=== Proposed refactoring steps for onboarding ===

These steps will progressively teach these practices to a new developer:

Step 1: {title}
  → Practice taught: {description}
  → Examples in the codebase: {files}

Step 2: {title}
  → Practice taught: {description}
  → Examples in the codebase: {files}

...
```

---

**STOP** — Wait for the tech lead's reaction.

The tech lead can:
- **Validate** as-is → proceed to the generation phase
- **Remove** steps → exclude them
- **Reorder** steps → adjust the order
- **Add** custom steps → integrate them
- **Modify** step details → adjust

Once the steps are validated, proceed to the generation phase (`01-generation.md`).
