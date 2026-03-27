# Vertical Slice Architecture

Code organization by feature (vertical slice) rather than by horizontal layer.

---

## Principle

Each feature is a self-contained co-located module: use case, port, adapter, domain, tests. No horizontal layers (no `services/`, `repositories/`, `controllers/` folders).

---

## Structure

```
src/modules/
├── {boundedContext}/                     # Bounded context = business domain
│   ├── {entity}.ts                      # Domain entities (shared between BC features)
│   ├── {valueObject}.ts                 # Domain Value Objects
│   ├── {aggregate}.ts                   # Domain Aggregate root
│   ├── {enumOrType}.ts                  # Domain types/enums
│   ├── rawTypes.ts                      # Raw DTOs (optional, if shared between features)
│   │
│   ├── {featureA}/                      # Feature A — vertical slice
│   │   ├── {featureA}.useCase.ts        # Use case
│   │   ├── {featureA}.{portName}.ts     # Port (interface)
│   │   ├── {featureA}.{techno}{PortName}.ts  # Prod adapter
│   │   └── test/                        # Co-located tests
│   │       ├── {featureA}.dsl.ts
│   │       ├── {featureA}.inMemory{PortName}.ts
│   │       └── usecase/
│   │           ├── {featureA}.useCase.spec.ts
│   │           └── {featureA}.useCaseDriver.ts
│   │
│   └── {featureB}/                      # Feature B — vertical slice
│       ├── {featureB}.useCase.ts
│       ├── ...
│       └── test/
│
└── shared/                              # Only truly cross-cutting code
    └── result/
        └── commandResult.ts
```

---

## Rules

### Co-location

- Each feature contains **everything** it needs: use case, ports, adapters, tests
- Tests are in a `test/` subfolder of the feature, not in a global `__tests__/` folder
- The in-memory adapter (for tests) is in `test/`, the prod adapter is in the feature folder

### Domain at the bounded context level

- Entities, value objects and aggregates live at the parent bounded context level (`modules/{boundedContext}/`)
- They are shared between features of the same bounded context
- They are **never** imported from another bounded context

### Shared = truly cross-cutting

- The `shared/` folder only contains code used by **multiple** bounded contexts
- Utility types (`CommandResult`, etc.) — no business logic
- If something is only used by a single bounded context, it belongs in that bounded context

### No horizontal layers

**Never** create:
- `src/services/` — logic belongs in use cases and domain
- `src/repositories/` — these are ports within each feature
- `src/controllers/` — the entry point directly orchestrates use cases
- `src/models/` — entities belong in their bounded context
- `src/utils/` — utilities go in `shared/` or are local to the feature

---

## Adding a new feature

1. Identify the bounded context (`modules/{boundedContext}/`)
2. Create a `{featureName}/` folder in the bounded context
3. Create the use case, port, prod adapter
4. Create the `test/` folder with DSL, in-memory adapter, driver, spec
5. If entities/VOs are needed and don't exist yet, create them at the bounded context level

---

## Adding a new bounded context

1. Create `modules/{newContext}/`
2. Define the domain entities/VOs/aggregates
3. Create the first feature as a vertical slice
4. The new bounded context communicates with others via JSON (contract), never by direct import
