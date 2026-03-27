# Phase 2: E2E test generation

## Required references

- `dsl`: example DSL file
- `e2eDriver`: example e2e driver
- `e2eSpec`: example e2e spec
- `testApp`: test infrastructure

## 2.1 Identify the vertical slice

From the scenario, identify:
- The **domain** (e.g., `core`, `generic`)
- The **bounded context** (e.g., `orderRegistration`, `identityAndAccessManagement`)
- The **feature** (e.g., `createUserAccount`, `startRegisterEmptyOrder`)

The test will be placed in: `backend/src/{domain}/{boundedContext}/{feature}/test/`

## 2.2 Generate the 3 files

**File 1: DSL** — `test/{feature}.dsl.ts`

One interface per scenario. `given`/`when`/`then` methods.

Naming conventions:
- **Actor actions → first person**: `whenICreateOrder()`, `thenImInformedOfError()`
- **System states → impersonal**: `givenProductsExist()`, `givenSystemIsOperational()`
- `when` methods take as parameter **only the field relevant to the scenario**. Other fields are hardcoded in the driver.

Reference: read the `dsl` reference file (resolved from config).

**File 2: E2E Driver** — `test/e2e/{feature}.e2eDriver.ts`

```typescript
import request from 'supertest';
import { expect } from 'vitest';
import { DataSource } from 'typeorm';
import { TestApp } from '@src/shared/test/e2e/testApp';
import type { ScenarioDSL } from '../{feature}.dsl';

export class ScenarioNameE2eDriver implements ScenarioDSL {
  private testApp!: TestApp;
  private response!: request.Response;

  async givenSystemIsOperational() {
    this.testApp = await TestApp.start();
  }

  // given... → setup (SQL insertion, config, etc.)
  // when...  → HTTP call via supertest
  // then...  → HTTP status assertions + SQL query

  async cleanup() {
    await this.testApp?.cleanup();
  }
}
```

**Driver rules:**
- Use `TestApp` from `@src/shared/test/e2e/testApp` — **never** `PostgreSqlContainer` directly
- `when`: `request(this.testApp.app.getHttpServer()).post('/api/...').send({...})`
- `then`: verify `this.response.status` + `this.testApp.app.get(DataSource).query('SELECT ...')`
- `cleanup()` calls `this.testApp?.cleanup()`

Reference: read the `e2eDriver` reference file (resolved from config).

**File 3: Spec** — `test/e2e/{feature}.e2e-spec.ts`

```typescript
import { describe, test, afterEach } from 'vitest';
import { ScenarioNameE2eDriver } from './{feature}.e2eDriver';

describe('Scenario description', () => {
  let driver: ScenarioNameE2eDriver;

  afterEach(async () => {
    await driver?.cleanup();
  });

  test('scenario name', async () => {
    driver = new ScenarioNameE2eDriver();
    await driver.givenSystemIsOperational();
    // ... given/when/then
  });
});
```

**Spec rules:**
- No logic, no assertions, no framework imports — just orchestration
- `afterEach` with `cleanup()` is mandatory
- Test body: instantiate the driver, call methods in order

Reference: read the `e2eSpec` reference file (resolved from config).

## 2.3 Run the test — must be RED

```bash
cd backend && npx vitest run --config vitest.e2e.config.ts {spec path}
```

The test must fail (compilation or assertion error). If the test passes, something is wrong — investigate.

## 2.4 Commit the test

```bash
git add {the 3 files}
git commit -m "tech: backend: e2e test onboarding {scenario name} (#{id})"
```

Display:
> "The e2e test is in place and failing (RED). This is expected — the production code doesn't exist yet."
