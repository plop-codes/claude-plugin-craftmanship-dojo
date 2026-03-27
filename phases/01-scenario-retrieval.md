# Phase 1: Scenario retrieval

## 1.1 Ask for the scenario

Ask the user for their scenario using `AskUserQuestion`:

> "How would you like to provide the scenario?\n- Give me a **GitHub ticket number** (e.g., `42` or `#42`)\n- Or **paste the scenario directly** here (Gherkin, free text, specs...)"

## 1.2 Retrieve the scenario

### Option A: GitHub ticket

If the user provides a ticket number:

**Single ticket:**
```bash
gh issue view <id> --json title,body,labels
```

**User Story (with sub-issues):**
Retrieve owner and repo:
```bash
gh repo view --json owner,name --jq '.owner.login + " " + .name'
```

Then retrieve sub-issues:
```bash
gh api graphql -f query='query {
  repository(owner: "{owner}", name: "{repo}") {
    issue(number: {NUM}) {
      title
      body
      subIssues(first: 50) {
        nodes {
          number
          title
          state
          body
          issueType { name }
          labels(first: 10) {
            nodes { name }
          }
        }
      }
    }
  }
}' --jq '.data.repository.issue'
```

**Scenario selection:**
- If single ticket → use that scenario
- If User Story → filter sub-issues with `state: OPEN` and `issueType.name == "Scenario / acceptance criteria"`, then take the **first** scenario found

### Option B: Pasted text scenario

If the user pastes the scenario directly (Gherkin, specs, free text), use it as-is. No need for `gh`.

## 1.4 Check the scope

**Critical rule**: this skill **ALWAYS** generates a backend e2e test.

If the scenario comes from a GitHub ticket with the `ui-test` label, or if the pasted scenario clearly describes a UI test (browser interactions, clicks, forms...), **REFUSE**:
> "This skill is backend-only. UI tests are not supported by the onboarding skill. Choose a backend scenario."

## 1.5 Extract the context

Extract from the ticket body (and parent US if applicable):
- **Gherkin scenario** (Given/When/Then)
- **Business rules**: validations, formats, constraints
- **API**: endpoints, HTTP methods, return codes, request/response formats
- **Domain names**: entities, properties, tables, columns
- **Technical constraints**: types, structures, relationships

## 1.6 Confirm with the user

Display the extracted scenario and context. Ask for confirmation before generating the test:
> "Here is the scenario I will use: ..."
> "Is this the right scenario? (yes/no)"

**STOP** — wait for confirmation.
