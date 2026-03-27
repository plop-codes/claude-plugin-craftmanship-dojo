# Proposal 4: Static Factory (`Entity.create()`)

## Required references

- `entity`: example entity with static factory

## Instructions

**Inspect**: does the entity have a public constructor, or does it use `private constructor` + `static create()`?

**Skip if**: the entity already uses the factory pattern.

**Why**:
- **Business language**: `Order.create(...)` is more expressive than `new Order(...)`. The method name can reflect the business intent.
- **Validation at creation**: the factory can validate data and return a `CommandResult` with a typed error instead of throwing an exception.
- **Immutability**: the private constructor prevents creating entities in an invalid state.

**Example**: read and show the `entity` reference file — note `static create()` which validates each Value Object and returns `CommandResult`. Also show how `static reconstitute()` allows recreating from the database (without validation).

**STOP** — wait for decision
