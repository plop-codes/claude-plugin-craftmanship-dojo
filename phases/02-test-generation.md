# Phase 2 : Generation du test e2e

## References necessaires

- `dsl` : exemple de fichier DSL
- `e2eDriver` : exemple de driver e2e
- `e2eSpec` : exemple de spec e2e
- `testApp` : infrastructure de test

## 2.1 Identifier le vertical slice

Depuis le scenario, identifie :
- Le **domain** (ex: `core`, `generic`)
- Le **bounded context** (ex: `orderRegistration`, `identityAndAccessManagement`)
- La **feature** (ex: `createUserAccount`, `startRegisterEmptyOrder`)

Le test sera place dans : `backend/src/{domain}/{boundedContext}/{feature}/test/`

## 2.2 Generer les 3 fichiers

**Fichier 1 : DSL** — `test/{feature}.dsl.ts`

Une interface par scenario. Methodes `given`/`when`/`then`.

Conventions de nommage :
- **Actions de l'acteur → premiere personne** : `whenICreateOrder()`, `thenImInformedOfError()`
- **Etats du systeme → impersonnel** : `givenProductsExist()`, `givenSystemIsOperational()`
- Les methodes `when` prennent en parametre **uniquement le champ pertinent au scenario**. Les autres champs sont hardcodes dans le driver.

Reference : lire le fichier de reference `dsl` (resolu depuis le config).

**Fichier 2 : Driver e2e** — `test/e2e/{feature}.e2eDriver.ts`

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

  // given... → setup (insertion SQL, config, etc.)
  // when...  → appel HTTP via supertest
  // then...  → assertions HTTP status + query SQL

  async cleanup() {
    await this.testApp?.cleanup();
  }
}
```

**Regles du driver :**
- Utilise `TestApp` de `@src/shared/test/e2e/testApp` — **jamais** `PostgreSqlContainer` directement
- `when` : `request(this.testApp.app.getHttpServer()).post('/api/...').send({...})`
- `then` : verifie `this.response.status` + `this.testApp.app.get(DataSource).query('SELECT ...')`
- `cleanup()` appelle `this.testApp?.cleanup()`

Reference : lire le fichier de reference `e2eDriver` (resolu depuis le config).

**Fichier 3 : Spec** — `test/e2e/{feature}.e2e-spec.ts`

```typescript
import { describe, test, afterEach } from 'vitest';
import { ScenarioNameE2eDriver } from './{feature}.e2eDriver';

describe('Description en francais du scenario', () => {
  let driver: ScenarioNameE2eDriver;

  afterEach(async () => {
    await driver?.cleanup();
  });

  test('nom du scenario en francais', async () => {
    driver = new ScenarioNameE2eDriver();
    await driver.givenSystemIsOperational();
    // ... given/when/then
  });
});
```

**Regles du spec :**
- Pas de logique, pas d'assertions, pas d'imports framework — juste l'orchestration
- `afterEach` avec `cleanup()` obligatoire
- Test body : instancie le driver, appelle les methodes dans l'ordre

Reference : lire le fichier de reference `e2eSpec` (resolu depuis le config).

## 2.3 Lancer le test — doit etre RED

```bash
cd backend && npx vitest run --config vitest.e2e.config.ts {chemin du spec}
```

Le test doit echouer (erreur de compilation ou d'assertion). Si le test passe, quelque chose ne va pas — investiguer.

## 2.4 Committer le test

```bash
git add {les 3 fichiers}
git commit -m "tech: backend: test e2e onboarding {nom du scenario} (#{id})"
```

Afficher :
> "Le test e2e est en place et echoue (RED). C'est normal — le code de production n'existe pas encore."
