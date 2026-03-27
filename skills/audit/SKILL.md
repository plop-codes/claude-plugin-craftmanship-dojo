---
name: audit
description: "Analyse une codebase backend et genere une roadmap de refactoring pedagogique pour configurer l'onboarding. Outil pour tech leads. Triggers: 'audit', 'audit archi', 'analyse mon code', 'diagnostic architecture', 'roadmap refactoring', '/audit'."
---

# Audit Architecture — Diagnostic et generation de roadmap refactoring

Ce skill analyse une codebase backend et propose des etapes de refactoring ordonnees pedagogiquement. Les etapes generees alimentent ensuite la Phase 6 du skill `/onboarding`.

**Ce skill s'adresse au tech lead / admin**, pas au developpeur en onboarding.

**Ce skill est agnostique** : il fonctionne sur n'importe quel langage et framework backend.

---

## Bootstrap — Lecture de la configuration

**Etape 1** : Lis le fichier de configuration :
- Chemin : `${CLAUDE_SKILL_DIR}/../../config.json`

Parse le JSON. Ce fichier determine :
- `language` : langue des messages (`"fr"` par defaut)
- `audit.scan-paths` : dossiers a scanner (defaut : `["src/"]`)
- `audit.default-levels` : dimensions a evaluer par defaut (toutes actives)
- `references` : ou trouver les fichiers de reference (null = embarque, chemin string = fichier du projet)

**Etape 2** : Resolution des references (meme logique que le skill onboarding).

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

Les phases s'executent **dans l'ordre**, sans exception. Lire chaque fichier de phase et suivre ses instructions.

| Phase | Fichier | Description |
|-------|---------|-------------|
| 1. Analyse | `${CLAUDE_SKILL_DIR}/../../phases/audit/00-analysis-guide.md` | Scanner la codebase, presenter le diagnostic, proposer la roadmap |
| 2. Generation | `${CLAUDE_SKILL_DIR}/../../phases/audit/01-generation.md` | Generer les fichiers de propositions et mettre a jour la config |

Tous les chemins de fichiers de phase sont relatifs a `${CLAUDE_SKILL_DIR}/../../`.

---

## Regles strictes

1. **Ne JAMAIS generer de propositions sans validation du tech lead** — toujours presenter le diagnostic et attendre la validation avant de generer les fichiers
2. **Adapter la detection au langage/framework detecte** — ne pas presupposer TypeScript ou NestJS. Les heuristiques doivent couvrir Java, C#, Go, Python, etc.
3. **Les propositions generees doivent suivre exactement le format existant** — pour etre compatibles avec le skill onboarding
4. **Tout en francais par defaut** — sauf si `config.language` est `"en"`
5. **Ordonner pedagogiquement** — des fondations vers l'avance. Chaque etape doit etre realisable independamment et enabler les suivantes
6. **Ne pas proposer d'etapes englobantes en premier** — privilegier les petites etapes fondamentales qui debloquent les suivantes
7. **Referencer le code existant** — montrer des fichiers concrets de la codebase analysee dans le diagnostic, pas du code theorique
8. **Respecter les decisions du tech lead** — s'il retire, reordonne ou ajoute des etapes, appliquer sans resistance
