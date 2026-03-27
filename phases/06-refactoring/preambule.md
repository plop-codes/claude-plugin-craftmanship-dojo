# Phase 6: Refactoring proposals (educational)

## Preamble

> "Your code works — the tests pass. Now, I'll suggest a few improvements to align your code with the project's practices. Each one is **optional**."
>
> "For each proposal, you can say:"
> - **'yes'** or **'ok'** → we do the refactoring together
> - **'skip'** or **'pass'** → we move to the next proposal
> - **'I don't want to refactor'** or **'stop'** → we stop the proposals

## Model for each proposal

For each proposal:
1. **Inspect** the developer's code to check if the proposal applies
2. **If not applicable** (the dev already did it right) → congratulate them and move to the next one
3. **If applicable** → explain why, show an example from the reference code, suggest the change
4. **STOP** — wait for the dev's decision

If the dev accepts: guide them step by step, but **let them code**. Explain what needs to be done, don't do it for them. If necessary, show a reference code excerpt as a model.

After each accepted refactoring: rerun `npm run test:e2e` to verify the tests still pass.
