---
name: audit
description: "Analyse les pratiques d'une codebase backend pour generer des etapes de refactoring qui les enseignent aux nouveaux developpeurs via l'onboarding. Outil pour tech leads. Triggers: 'audit', 'audit archi', 'analyse mon code', 'diagnostic architecture', 'roadmap refactoring', '/audit'."
---

# Audit — Adapter l'onboarding aux pratiques de votre codebase

Ce skill analyse les pratiques et conventions deja en place dans une codebase backend, puis genere des etapes de refactoring qui les enseignent progressivement a un developpeur qui ne les maitrise pas encore. Ces etapes alimentent la Phase 6 du skill `/onboarding`.

**Ce skill s'adresse au tech lead**, pas au developpeur en onboarding.

**Ce skill est agnostique** : il fonctionne sur n'importe quel langage et framework backend.

---

## Bootstrap — Lecture de la configuration

**Etape 1** : Lis le fichier de configuration :
- Chemin : `${CLAUDE_SKILL_DIR}/../../config.json`

Parse le JSON. Ce fichier determine :
- `language` : langue des messages (`"fr"` par defaut)
- `audit.scan-paths` : dossiers a scanner (defaut : `["src/"]`)
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
| 1. Analyse | `${CLAUDE_SKILL_DIR}/../../phases/audit/00-analysis-guide.md` | Identifier les pratiques existantes et proposer des etapes de refactoring pour les enseigner |
| 2. Generation | `${CLAUDE_SKILL_DIR}/../../phases/audit/01-generation.md` | Generer les fichiers de propositions et mettre a jour la config |

Tous les chemins de fichiers de phase sont relatifs a `${CLAUDE_SKILL_DIR}/../../`.

---

## Regles strictes

1. **Ne JAMAIS generer de propositions sans validation du tech lead** — toujours presenter les etapes proposees et attendre la validation avant de generer les fichiers
2. **Ne JAMAIS proposer une pratique absente de la codebase** — si aucun fichier existant n'illustre la pratique, elle ne doit pas devenir une etape. Seul le tech lead peut ajouter des pratiques aspirationnelles
3. **Adapter la detection au langage/framework detecte** — ne pas presupposer TypeScript ou NestJS
4. **Les propositions generees doivent suivre exactement le format existant** — pour etre compatibles avec le skill onboarding
5. **Tout en francais par defaut** — sauf si `config.language` est `"en"`
6. **Ordonner pedagogiquement** — des pratiques les plus simples aux plus avancees. Chaque etape doit etre comprehensible independamment
7. **Referencer le code existant** — chaque etape doit citer des fichiers concrets de la codebase qui illustrent deja la pratique enseignee
8. **Respecter les decisions du tech lead** — s'il retire, reordonne ou ajoute des etapes, appliquer sans resistance
