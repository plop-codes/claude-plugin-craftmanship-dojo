# Proposal 3: Encapsulation / Object-oriented

## Required references

- `entity`: example entity with business methods
- Skill: `ddd-patterns`

## Instructions

**Inspect**: does the use case directly modify an entity's properties, or does it go through the entity's business methods?

**Skip if**: the entity exposes business methods and the use case uses them.

**Why**: the aggregate root is the **guardian of business invariants**. If the use case directly modifies `entity.name = 'foo'`, any code can break the rules. By going through `entity.rename('foo')`, the entity can validate, check constraints, and guarantee consistency.

**Example**: read and show the `entity` reference file — note the business methods that encapsulate mutations. Also read the `ddd-patterns` reference skill for aggregate root principles.

**STOP** — wait for decision
