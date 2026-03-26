# Vertical Slice Architecture

Organisation du code par feature (vertical slice) plutot que par couche horizontale.

---

## Principe

Chaque feature est un module autonome co-localise : use case, port, adapter, domaine, tests. Pas de couches horizontales (pas de dossier `services/`, `repositories/`, `controllers/`).

---

## Structure

```
src/modules/
├── {boundedContext}/                     # Bounded context = domaine metier
│   ├── {entity}.ts                      # Entites du domaine (partagees entre features du BC)
│   ├── {valueObject}.ts                 # Value Objects du domaine
│   ├── {aggregate}.ts                   # Aggregate root du domaine
│   ├── {enumOrType}.ts                  # Types/enums du domaine
│   ├── rawTypes.ts                      # DTOs bruts (optionnel, si partages entre features)
│   │
│   ├── {featureA}/                      # Feature A — vertical slice
│   │   ├── {featureA}.useCase.ts        # Use case
│   │   ├── {featureA}.{portName}.ts     # Port (interface)
│   │   ├── {featureA}.{techno}{PortName}.ts  # Adapter prod
│   │   └── test/                        # Tests co-localises
│   │       ├── {featureA}.dsl.ts
│   │       ├── {featureA}.inMemory{PortName}.ts
│   │       └── usecase/
│   │           ├── {featureA}.useCase.spec.ts
│   │           └── {featureA}.useCaseDriver.ts
│   │
│   └── {featureB}/                      # Feature B — vertical slice
│       ├── {featureB}.useCase.ts
│       ├── ...
│       └── test/
│
└── shared/                              # Uniquement le code veritablement transversal
    └── result/
        └── commandResult.ts
```

---

## Regles

### Co-localisation

- Chaque feature contient **tout** ce dont elle a besoin : use case, ports, adapters, tests
- Les tests sont dans un sous-dossier `test/` de la feature, pas dans un dossier `__tests__/` global
- L'adapter in-memory (pour les tests) est dans `test/`, l'adapter prod est dans le dossier de la feature

### Domaine au niveau du bounded context

- Les entites, value objects et aggregates vivent au niveau du bounded context parent (`modules/{boundedContext}/`)
- Ils sont partages entre les features du meme bounded context
- Ils ne sont **jamais** importes depuis un autre bounded context

### Shared = vraiment transversal

- Le dossier `shared/` ne contient que le code utilise par **plusieurs** bounded contexts
- Types utilitaires (`CommandResult`, etc.) — pas de logique metier
- Si quelque chose n'est utilise que par un seul bounded context, il va dans ce bounded context

### Pas de couches horizontales

Ne **jamais** creer :
- `src/services/` — la logique est dans les use cases et le domaine
- `src/repositories/` — ce sont des ports dans chaque feature
- `src/controllers/` — l'entry point orchestre directement les use cases
- `src/models/` — les entites sont dans leur bounded context
- `src/utils/` — les utilitaires sont dans `shared/` ou locaux a la feature

---

## Ajout d'une nouvelle feature

1. Identifier le bounded context (`modules/{boundedContext}/`)
2. Creer un dossier `{featureName}/` dans le bounded context
3. Creer le use case, le port, l'adapter prod
4. Creer le dossier `test/` avec DSL, adapter in-memory, driver, spec
5. Si des entites/VO sont necessaires et n'existent pas encore, les creer au niveau du bounded context

---

## Ajout d'un nouveau bounded context

1. Creer `modules/{newContext}/`
2. Definir les entites/VO/aggregates du domaine
3. Creer la premiere feature comme vertical slice
4. Le nouveau bounded context communique avec les autres via JSON (contrat), jamais par import direct
