# Proposal 6: Business error handling with `CommandResult` (no exceptions)

## Required references

- `useCase`: example use case with CommandResult
- `controller`: example controller with error switch
- `commandResult`: CommandResult implementation

## Instructions

**Inspect**: does the use case use `throw new Error(...)` or exceptions to signal business errors (failed validation, entity not found, duplicate, etc.)? Or does it return a `CommandResult<E>`?

**Skip if**: the use case already returns `CommandResult<E>` with typed errors (enum).

**Why**:
- **Exceptions are for exceptional cases** (network failure, database unreachable) — not for business logic. An invalid email is a normal business case, not an exception.
- With `throw`, the controller must use a `try/catch` and guess the error type (string? custom class?). This is fragile, untyped, and hard to test.
- With `CommandResult<E>`, the use case **explicitly declares** possible errors in its return type. The controller does a `switch (result.getError())` with **enum** values — it's exhaustive, typed, and the compiler can verify all cases are handled.
- The flow is linear: no `try/catch`, no surprises. The code reads top to bottom.

**The complete pattern**:
1. The use case returns `Promise<CommandResult<E>>` where `E` is an enum or error type union
2. On success: `CommandResult.success()` or `CommandResult.success(viewModel)` for queries
3. On business error: `CommandResult.failure(ErrorEnum.VALUE)`
4. The controller checks `result.isSuccess()` / `result.isFailure()` and maps to the correct HTTP status via a `switch`
5. The type `E` is `never` as long as no error scenario exists — it evolves naturally when error cases are added

**Example — the use case**: read and show the `useCase` reference file. Note:
- The use case error enum
- The type union combining domain errors (VOs) and use case errors
- The `CommandResult.failure(result.getError())` return that propagates the domain error
- The `try/catch` only for infra errors (DB access), not for business logic

**Example — the controller**: read and show the `controller` reference file. Note:
- The `switch (result.getError())` that maps each error to an HTTP status (409, 400, 500)
- No `try/catch` — the controller doesn't handle exceptions
- The linear flow: success → 201, otherwise switch on the error

**Example — the CommandResult itself**: read and show the `commandResult` reference file. Explain:
- `private constructor` — impossible to create a result in an inconsistent state
- `static success()` / `static failure()` — explicit factories
- `getValue<T>()` / `getError()` — safe access (throws if misused, but that's a programming bug, not a business error)

**STOP** — wait for decision
