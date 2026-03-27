# Phase 2: Proposal file generation

The steps have been validated by the tech lead. Generate the proposal files and update the configuration.

---

## Step 1: Delete old proposals

If proposal files already exist in `phases/06-refactoring/proposals/`, delete them **after tech lead confirmation**:

> "Existing proposals were detected in `phases/06-refactoring/proposals/`. I will replace them with the newly validated steps. Do you confirm?"

If the tech lead confirms, delete all `*.md` files in that folder.
If the tech lead refuses, keep the old files and add the new ones after (continuing numbering).

---

## Step 2: Generate proposal files

For each validated step, create a file in `phases/06-refactoring/proposals/`.

### File naming

Format: `{2-digit number}-{slug}.md`

Examples:
- `01-vertical-slices.md`
- `02-entity-encapsulation.md`
- `03-value-objects.md`
- `04-in-memory-repositories.md`

### Format for each file

Each file MUST follow exactly this format (compatible with the onboarding skill):

```markdown
# Proposal {N}: {Title}

## Required references

{List of relevant references, if applicable}
- Skill: `{skill-key}`
- Example: `{example-key}`

{If no reference is relevant, write: "No bundled reference. Rely on existing project code."}

## Instructions

**Inspect**: {precise description of what to check in the onboarding developer's code — which files to look at, which patterns to search for}

**Skip if**: {conditions where this proposal doesn't apply — for example if the dev already applied this practice}

**Practice taught**: {pedagogical explanation — which codebase convention the dev learns here, why the team does it this way, with examples of existing project files that illustrate this practice}

**Example**: {what to show — existing codebase files that serve as a model. Prefer real project files over bundled reference files, since the goal is to teach THIS codebase's practices.}

**STOP** — wait for decision
```

### Generation rules

1. **Each file must be self-contained**: readable and understandable without external context
2. **Instructions must be concrete**: cite file patterns specific to the detected language/framework
3. **The "Practice taught" must be pedagogical**: explain the convention as if to a developer discovering the codebase for the first time
4. **Prefer project examples**: existing codebase files are the best examples since they show exactly how the team does it. The plugin's bundled reference files are only useful if the codebase doesn't have a sufficient example.
5. **The "Inspect" must be adapted to the framework**: use detection patterns from the framework identified in the analysis phase

---

## Step 3: Update config.json

Update the `config.json` file at the plugin root:

### `proposals` section

Replace the `proposals` content with the new keys, one per validated step:

```json
{
  "proposals": {
    "{step-1-slug}": true,
    "{step-2-slug}": true,
    ...
  }
}
```

Slugs must exactly match the file names (without number or extension).
Example: file `03-vertical-slices.md` → key `vertical-slices`.

### `audit` section

Update the `audit` section with the scanned paths:

```json
{
  "audit": {
    "scan-paths": ["{scanned paths}"]
  }
}
```

---

## Step 4: Update the Phase 6 mapping table in the onboarding skill

Read the `skills/onboarding/SKILL.md` file and update the Phase 6 mapping table (section "Phase 6: Refactoring") to reflect the new proposals.

Table format:

```markdown
| Config key | File |
|------------|------|
| `{slug}` | `phases/06-refactoring/proposals/{number}-{slug}.md` |
```

One line per generated proposal.

---

## Step 5: Final summary

Present a summary to the tech lead:

> **Generation complete.**
>
> **{N} steps created** in `phases/06-refactoring/proposals/`:
> - `01-{slug}.md` — {title}
> - `02-{slug}.md` — {title}
> - ...
>
> **`config.json` updated** with the new proposal keys.
>
> **`skills/onboarding/SKILL.md` updated** with the Phase 6 mapping table.
>
> Developers can now use `/onboarding` to be guided through these refactoring steps.
