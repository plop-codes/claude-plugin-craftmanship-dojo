# Architecture — Ports & Adapters / Clean Architecture

Organisation du code, conventions de nommage, et flux de donnees.

---

## Regle fondamentale

**Le domaine ne connait jamais l'infrastructure.** L'API externe (Figma, GitHub, base de donnees, etc.) est un adaptateur qui implemente un port. Le domaine n'importe jamais d'adapter.

### Flux de dependances

```
entryPoint → UseCase → Aggregate/Entite/VO (domaine pur)
                ↓
              Port (interface)
                ↑
            Adapter (prod: API externe, test: InMemory)
```

---

## Structure des modules

```
src/
├── entryPoint.ts                          # Entry point — orchestre les use cases
├── modules/
│   ├── {boundedContext}/                   # Bounded context
│   │   ├── {entity}.ts                    # Entite
│   │   ├── {valueObject}.ts               # Value Object
│   │   ├── {aggregate}.ts                 # Aggregate root
│   │   └── {feature}/                     # Use case (vertical slice)
│   │       ├── {feature}.useCase.ts
│   │       ├── {feature}.{portName}.ts    # Port (interface)
│   │       ├── {feature}.figma{PortName}.ts  # Adapter prod
│   │       └── test/                      # Tests co-localises
│   └── shared/
│       └── result/
│           └── commandResult.ts           # Type partage entre modules
```

---

## Conventions de nommage des fichiers

| Type | Pattern | Exemple |
|------|---------|---------|
| Entite | `{entity}.ts` | `element.ts`, `issuableElement.ts` |
| Value Object | `{valueObject}.ts` | `release.ts` |
| Aggregate root | `{aggregate}.ts` | `impactMapping.ts` |
| Use case | `{feature}.useCase.ts` | `analyzeImpactMap.useCase.ts` |
| Port (interface) | `{feature}.{portName}.ts` | `analyzeImpactMap.boardReader.ts` |
| Adapter prod | `{feature}.{techno}{PortName}.ts` | `analyzeImpactMap.figmaBoardReader.ts` |
| Adapter test | `{feature}.inMemory{PortName}.ts` | `analyzeImpactMap.inMemoryBoardReader.ts` |
| DSL test | `{feature}.dsl.ts` | `analyzeImpactMap.dsl.ts` |
| Raw types (DTOs) | dans le fichier du port | types dans `analyzeImpactMap.boardReader.ts` |

---

## Ports

Interface unique par use case. Definit les types bruts (DTOs) dans le meme fichier.

```typescript
// analyzeImpactMap.boardReader.ts
export type RawConnector = { startNodeId: string; endNodeId: string };
export type RawBoardData = { shapes: RawShapeWithBounds[]; connectors: RawConnector[]; sections: RawSectionData[] };

export interface AnalyzeImpactMapBoardReader {
  readBoard(): RawBoardData;
}
```

### Regles ports

- Les types du port sont des DTOs simples (pas d'objets domaine)
- Un port par use case (pas de port partage entre use cases)
- Le port est dans le dossier du use case, pas dans le domaine

---

## Use Case

Orchestrateur fin. Injection de dependances par constructeur. Retourne `CommandResult<string>`.

```typescript
export class AnalyzeImpactMapUseCase {
  constructor(private readonly boardReader: AnalyzeImpactMapBoardReader) {}

  execute(): CommandResult<string> {
    const board = this.boardReader.readBoard();
    const result = ImpactMapping.generateFromBoard(...);
    if (result.isFailure()) return CommandResult.failure(result.getError());
    return CommandResult.success(result.getValue<ImpactMapping>().toJson());
  }
}
```

### Regles use case

- **Pas de logique metier** dans le use case — deleguer aux aggregates/entites
- **Pas de `try/catch`** sauf si le port peut throw (adapter externe)
- Injection par constructeur, pas de framework DI
- Une seule methode `execute()`

---

## CommandResult

Type partage pour les resultats qui peuvent echouer.

```typescript
CommandResult.success(value?)    // succes avec valeur optionnelle
CommandResult.failure(error)     // echec avec message d'erreur
result.isSuccess() / isFailure()
result.getValue<T>()
result.getError()
```

---

## Communication entre bounded contexts

Les bounded contexts communiquent via JSON (contrat). Pas de dependance directe entre domaines.

```
contextA.toJson() → JSON → contextB.execute(json)
```

---

## Regles transverses

- **Pas de barrel files** (`index.ts`) — imports directs vers le fichier source
- **Pas de `any`** — TypeScript strict
- **Pas de classes abstraites** — composition via interfaces (ports)
- **JAMAIS de ports dans le domain model** : les entites et VOs ne doivent **jamais** importer ni recevoir d'interfaces de port (repository, hasher, provider, etc.). Le model recoit uniquement des **valeurs finales** (strings, numbers, dates, autres VOs). C'est le **use case** qui appelle les ports et passe les resultats au model.
