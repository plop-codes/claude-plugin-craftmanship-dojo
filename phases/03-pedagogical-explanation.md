# Phase 3: Pedagogical explanation (interactive)

## Required references

- `dsl`: example DSL file
- `e2eDriver`: example e2e driver
- `testApp`: test infrastructure (TestApp)

## Preamble

> "Now that the test is in place, I'll explain how each part works. Say **'got it'** (or 'ok', 'next') after each explanation to move to the next one."

6 explanation points. Each one is followed by a **STOP** — wait for the user to confirm before continuing.

---

### 3.1 — The DSL (the interface)

Explain:
- The DSL is a **contract** written in business language. It's a pure TypeScript interface, with no implementation.
- It describes **what** the test verifies, not **how** it verifies it.
- Advantage: the same DSL can have an e2e driver (with database) AND a unit driver (in-memory). The spec doesn't change.
- Show the generated DSL, then read and show an excerpt from the `dsl` reference file as a mature example with multiple interfaces.

**STOP** — wait for "got it"

---

### 3.2 — The Driver (the contract implementation)

Explain:
- The driver **implements** the DSL. All framework-specific code (HTTP, SQL, containers) lives here.
- Each scenario has its own driver. One driver = one class that implements a DSL interface.
- Private fields: `testApp` (the NestJS application + containers) and `response` (the HTTP response).
- `given...()` = context setup (data insertion, configuration)
- `when...()` = action (HTTP call)
- `then...()` = verification (HTTP status + database state)
- Show the generated driver, then read and show an excerpt from the `e2eDriver` reference file.

**STOP** — wait for "got it"

---

### 3.3 — The Spec (the simple orchestrator)

Explain:
- The spec is the simplest file: it instantiates the driver and calls methods in order.
- **No logic**, no `expect`, no test framework imports (except vitest describe/test).
- Advantage: by reading the spec, you understand the business scenario in 5 seconds. It's living documentation.
- Show the generated spec.

**STOP** — wait for "got it"

---

### 3.4 — TestApp (the test infrastructure)

Explain:
- `TestApp.start()` starts the required containers (PostgreSQL, Mailpit, etc.) then creates the NestJS application connected to those containers.
- Environment variables (`POSTGRES_HOST`, `SMTP_HOST`, etc.) are dynamically configured with the container ports.
- `cleanup()` cleanly shuts everything down (NestJS app + containers).
- Read and show the contents of the `testApp` reference file.

**STOP** — wait for "got it"

---

### 3.5 — Supertest (HTTP calls)

Explain:
- `request(this.testApp.app.getHttpServer())` creates an HTTP client pointing to the test's NestJS server.
- `.post('/api/...')` or `.get('/api/...')` makes a real HTTP call, just like a browser or Postman would.
- `.send({...})` sends the JSON body.
- The response is stored in `this.response` for `then` assertions.
- It's a real integration test: the request passes through the controller, use case, repository, and database.
- Show the example from the generated driver.

**STOP** — wait for "got it"

---

### 3.6 — Raw SQL (database verification)

Explain:
- `this.testApp.app.get(DataSource).query('SELECT ...')` executes a direct SQL query on the test database.
- Why raw SQL instead of the ORM? To verify what is **actually** persisted, independently of the TypeORM mapping. If the mapping is wrong, the SQL test will catch it.
- It's the same principle as verifying a result "by hand" rather than trusting the tool.
- Show the example from the generated driver.

**STOP** — wait for "got it"

---

## Transition

> "You now understand how the e2e test works. Let's move on to development!"
