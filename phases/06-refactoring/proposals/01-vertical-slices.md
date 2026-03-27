# Proposal 1: Vertical Slices

## Required references

- Skill: `vertical-slice`

## Instructions

**Inspect**: is all the feature code in the correct folder `src/{domain}/{boundedContext}/{feature}/`?

**What can be shared** (and therefore live outside the vertical slice):
- Domain entities (`shared/` within the bounded context)
- Value Objects
- Shared NestJS modules

**Everything else** (controller, use case, repository interface, repository implementation) must be in the vertical slice.

**Why**: co-location allows understanding a feature by looking at a single folder. No need to navigate between `controllers/`, `services/`, `repositories/` — everything is in one place.

**Example**: show the developer's feature folder structure. Read the `vertical-slice` reference skill for the principles.

**STOP** — wait for decision
