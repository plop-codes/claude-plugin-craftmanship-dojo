# Proposal 7: Unit tests on the UseCase

## Required references

- `inMemoryRepository`: example in-memory repository
- `useCaseDriver`: example unit test driver
- Skill: `architecture`

## Instructions

**Inspect**: does the feature have unit tests on the use case (`test/usecase/` folder)?

**Skip if**: unit tests already exist.

**Why**:
- E2E tests are **slow** (starting Docker containers, ~5-10 seconds per test). Great for verifying everything works end to end, but not ideal for iterating quickly on business logic.
- Unit tests with an **in-memory repository** are **instant** and test the logic in isolation.
- For this, you need an **interface** for the repository (a **port**). The use case depends on the interface, not the TypeORM implementation. In tests, you inject an in-memory repository. In production, you inject the TypeORM repository.
- This is the **Ports & Adapters** pattern: the interface is the port, the implementations (TypeORM, in-memory) are the adapters.

**Example**: read and show:
- The `inMemoryRepository` reference file — the test adapter
- The `useCaseDriver` reference file — the unit driver that injects the in-memory
- The `architecture` reference skill for Ports & Adapters principles

**Do not implement** the unit tests in this skill. Just explain the concept and show the examples. The developer can use the `/atdd` skill (use case variant) for this later.

**STOP** — wait for decision
