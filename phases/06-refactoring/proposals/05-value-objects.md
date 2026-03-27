# Proposal 5: Validations in Value Objects

## Required references

- `valueObject`: example Value Object with validation
- `entity`: example entity that aggregates VOs

## Instructions

**Inspect**: are validations (email format, min/max length, allowed values) inline in the entity or use case, or in dedicated Value Objects?

**Skip if**: validations are already in VOs.

**Why**:
- Each validation rule has a **name** (it's a business concept, not just an `if`)
- Each VO has its own **error enum** — the entity's error type is a type union of each VO's errors
- VOs are **testable in isolation** and **reusable** across entities
- `VO.create()` returns `CommandResult<VoError>`, `VO.from()` reconstructs without validation (trusted data, e.g., from DB)

**Example**: read and show the `valueObject` reference file — note the `private constructor`, `static create()` with validation, `static from()` without validation, and the validation error enum.

Also show the `entity` reference file to see how the entity aggregates VOs and propagates errors.

**STOP** — wait for decision
