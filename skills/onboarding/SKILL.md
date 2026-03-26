---
name: onboarding
description: "Guide interactif d'onboarding pour nouveaux developpeurs backend. Propositions de refactoring selectionnables, fichiers de reference embarques et remplacables. Triggers: 'onboarding', 'onboard moi', 'guide moi', 'je suis nouveau', '/onboarding', 'nouveau developpeur', 'tutoriel backend'."
---

# Onboarding Backend — Guide interactif configurable

Ce skill guide un nouveau developpeur a travers l'implementation d'une feature backend, de bout en bout. Il est **configurable** : propositions de refactoring et fichiers de reference sont parametrables via `config.json`.

**Ce skill est backend-only.** Il ne gere pas les tests UI.

---

## Bootstrap — Lecture de la configuration

**Etape 1** : Lis le fichier de configuration :
- Chemin : `${CLAUDE_SKILL_DIR}/../../config.json`

Parse le JSON. Ce fichier determine :
- `proposals` : quelles propositions de refactoring inclure en phase 6 (true/false)
- `references` : ou trouver les fichiers de reference (null = embarque, chemin string = fichier du projet)

**Etape 2** : Resolution des references.

Pour chaque entree dans `references.skills` :
- Si la valeur est `null` → le fichier embarque est dans `${CLAUDE_SKILL_DIR}/../../references/skills/{cle}.md`
- Si la valeur est un chemin string → lire ce fichier depuis le projet

Pour chaque entree dans `references.examples` :
- Si la valeur est `null` → le fichier embarque est dans `${CLAUDE_SKILL_DIR}/../../references/examples/{cle}.ts`
  - Mapping des cles vers les noms de fichiers embarques :
    - `testApp` → `testApp.ts`
    - `commandResult` → `commandResult.ts`
    - `dsl` → `createUserAccount.dsl.ts`
    - `e2eDriver` → `createUserAccount.e2eDriver.ts`
    - `e2eSpec` → `createUserAccount.e2e-spec.ts`
    - `useCase` → `createUserAccount.useCase.ts`
    - `controller` → `createUserAccount.controller.ts`
    - `entity` → `userAccount.entity.ts`
    - `valueObject` → `userAcountEmail.vo.ts`
    - `inMemoryRepository` → `createUserAccount.inMemoryRepository.ts`
    - `useCaseDriver` → `createUserAccount.useCaseDriver.ts`
- Si la valeur est un chemin string → lire ce fichier depuis le projet

---

## Execution des phases

Les 6 phases s'executent **toujours dans l'ordre**, sans exception. Lire chaque fichier de phase et suivre ses instructions.

| Phase | Fichier |
|-------|---------|
| 1. Recuperation du scenario | `${CLAUDE_SKILL_DIR}/../../phases/01-scenario-retrieval.md` |
| 2. Generation du test e2e | `${CLAUDE_SKILL_DIR}/../../phases/02-test-generation.md` |
| 3. Explication pedagogique | `${CLAUDE_SKILL_DIR}/../../phases/03-pedagogical-explanation.md` |
| 4. Developpement libre | `${CLAUDE_SKILL_DIR}/../../phases/04-free-development.md` |
| 5. Validation | `${CLAUDE_SKILL_DIR}/../../phases/05-validation.md` |
| 6. Refactoring | Voir ci-dessous |

### Phase 6 : Refactoring

1. Lire `${CLAUDE_SKILL_DIR}/../../phases/06-refactoring/preambule.md` et suivre ses instructions
2. Pour chaque cle dans `config.proposals` ou la valeur est `true`, lire le fichier de proposition correspondant :

| Cle config | Fichier |
|------------|---------|
| `vertical-slices` | `phases/06-refactoring/proposals/01-vertical-slices.md` |
| `controller-purity` | `phases/06-refactoring/proposals/02-controller-purity.md` |
| `encapsulation` | `phases/06-refactoring/proposals/03-encapsulation.md` |
| `static-factory` | `phases/06-refactoring/proposals/04-static-factory.md` |
| `value-objects` | `phases/06-refactoring/proposals/05-value-objects.md` |
| `command-result` | `phases/06-refactoring/proposals/06-command-result.md` |
| `unit-tests` | `phases/06-refactoring/proposals/07-unit-tests.md` |
| `sql-reads` | `phases/06-refactoring/proposals/08-sql-reads.md` |

3. Lire `${CLAUDE_SKILL_DIR}/../../phases/06-refactoring/closure.md` et suivre ses instructions

Tous les chemins de fichiers de phase sont relatifs a `${CLAUDE_SKILL_DIR}/../../`.

---

## Regles strictes

1. **Backend-only** — refuser les tickets avec label `ui-test`
2. **Toujours e2e** — quel que soit le label (`backend-usecase-test` ou `backend-e2e-test`), generer un test e2e
3. **Utiliser `TestApp`** — jamais `PostgreSqlContainer` directement
4. **Tout en francais** — explications, messages, commentaires (sauf si `config.language` est `"en"`)
5. **NE JAMAIS ecrire le code de la feature** a la place du developpeur (Phases 4/5) — c'est educatif
6. **NE JAMAIS sauter les explications** de la Phase 3 — chaque point doit etre confirme individuellement
7. **NE JAMAIS passer en Phase 6** si les tests ne passent pas en Phase 5
8. **Toutes les propositions de refacto sont optionnelles** — respecter "skip" et "je ne veux pas refactorer"
9. **Referencer le code existant** — lire et montrer des extraits des fichiers de reference (embarques ou projet), pas de code theorique
10. **Guider, pas faire** — en Phase 6, expliquer et montrer des exemples, laisser le dev coder
