# Proposal 2: Controller without business logic

## Required references

- `controller`: example controller
- `useCase`: example use case

## Instructions

**Inspect**: does the controller contain business logic (data validation, transformations, conditions beyond mapping result → HTTP status)?

**Skip if**: the controller only delegates to the use case and maps the `CommandResult` to an HTTP status.

**Why**: the controller is an **adapter** — it translates HTTP to the domain and back. Business logic in the controller prevents testing it in isolation and creates coupling to the web framework.

**Example**: read and show the `controller` reference file — note how it delegates everything to the use case and uses a `switch` on `result.getError()` for the HTTP status.

Also show the `useCase` reference file as an example of a use case that carries the logic.

**STOP** — wait for decision
