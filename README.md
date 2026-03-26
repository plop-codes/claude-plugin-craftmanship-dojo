# onboarding-backend

Plugin Claude Code pour l'onboarding de nouveaux developpeurs backend.

Guide interactif en 6 phases : recuperation du scenario depuis un ticket GitHub, generation d'un test e2e comme rail de securite, explication pedagogique du pattern DSL/Driver/Spec, developpement libre, validation, puis propositions de refactoring educatives.

## Pourquoi ce plugin ?

### Eliminer les PR asynchrones

Les code reviews asynchrones par pull request posent des problemes bien connus :

- **Feedback differe** — le developpeur a change de contexte quand les retours arrivent, ce qui rallonge les cycles et fragmente l'attention
- **Reviews superficielles** — sous pression de ne pas bloquer l'equipe, les reviewers survolent le code au lieu de l'analyser en profondeur
- **Effet gatekeeper** — la review devient un point de controle hierarchique plutot qu'un moment d'apprentissage
- **Ping-pong de commentaires** — les allers-retours asynchrones sur un detail de design prennent des jours au lieu de minutes
- **Conventions implicites** — les pratiques attendues ne sont decouvertes qu'au moment de la review, trop tard pour les integrer naturellement

### Faciliter le Trunk-Based Development

Ce plugin permet de travailler en Trunk-Based Development en toute confiance : le developpeur sait que sa feature fonctionne grace au test e2e genere en test-first, et peut pusher directement sur trunk. Pas de branche longue, pas de merge penible, pas de PR qui attend.

### Faire progresser les equipes sans micro-management

Le refactoring est propose de maniere educative apres que la feature fonctionne. Les pratiques du projet (vertical slices, DDD, encapsulation...) sont enseignees progressivement, au fil des features, sans jamais bloquer le push. Le developpeur apprend en faisant, a son rythme, guide par le plugin — pas par un senior qui fait office de gatekeeper.

## Installation

```bash
claude --plugin-dir ./onboarding-backend
```

Puis invoquer :
```
/onboarding-backend:onboarding
```

## Configuration

Editer `config.json` a la racine du plugin.

### Propositions de refactoring

Activer/desactiver les propositions de la phase 6 :

```json
{
  "proposals": {
    "vertical-slices": true,
    "controller-purity": true,
    "encapsulation": false,
    "static-factory": true,
    "value-objects": true,
    "command-result": true,
    "unit-tests": false,
    "sql-reads": true
  }
}
```

### Fichiers de reference

Par defaut, le plugin embarque des fichiers d'exemple. Pour utiliser vos propres fichiers, remplacez `null` par un chemin relatif au projet :

```json
{
  "references": {
    "skills": {
      "vertical-slice": null,
      "ddd-patterns": ".claude/skills/my-ddd/SKILL.md",
      "architecture": null
    },
    "examples": {
      "testApp": "backend/src/shared/test/e2e/testApp.ts",
      "useCase": "backend/src/myFeature/myFeature.useCase.ts",
      "controller": "backend/src/myFeature/myFeature.controller.ts",
      "entity": null,
      "valueObject": null,
      "dsl": null,
      "e2eDriver": null,
      "e2eSpec": null,
      "commandResult": null,
      "inMemoryRepository": null,
      "useCaseDriver": null
    }
  }
}
```

## Structure

```
onboarding-backend/
├── plugin.json                    # Manifeste
├── config.json                    # Configuration (proposals + references)
├── skills/onboarding/SKILL.md     # Orchestrateur
├── phases/                        # 6 phases (fixes, toujours executees)
│   ├── 01-scenario-retrieval.md
│   ├── 02-test-generation.md
│   ├── 03-pedagogical-explanation.md
│   ├── 04-free-development.md
│   ├── 05-validation.md
│   └── 06-refactoring/
│       ├── preambule.md
│       ├── closure.md
│       └── proposals/             # 8 propositions (configurables)
├── references/
│   ├── skills/                    # 3 skills embarques
│   └── examples/                  # 11 fichiers TypeScript embarques
└── README.md
```

## Les 6 phases

| Phase | But | Qui code ? |
|-------|-----|-----------|
| 1. Recuperation du scenario | Identifier le ticket et extraire le Gherkin | Claude |
| 2. Generation du test e2e | Creer les fichiers DSL/Driver/Spec e2e | Claude |
| 3. Explication pedagogique | Comprendre chaque composant du test | Personne (discussion) |
| 4. Developpement libre | Implementer la feature | Le developpeur |
| 5. Validation | Verifier que le test e2e passe | Claude lance les tests |
| 6. Propositions de refactoring | Ameliorer le code etape par etape | Le developpeur (guide) |

## Les 8 propositions de refactoring

1. Vertical Slices — organisation du code
2. Controller sans logique metier — separation des responsabilites
3. Encapsulation — principes orientes objet
4. Static Factory — pattern `Entity.create()`
5. Value Objects — extraction des validations
6. CommandResult — gestion d'erreurs typee (pas d'exceptions)
7. Tests unitaires — use case testing avec repository in-memory
8. SQL pour les lectures — SQL brut au lieu de l'ORM
