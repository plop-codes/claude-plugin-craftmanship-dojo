# Architecture — Ports & Adapters / Clean Architecture

Code organization, naming conventions, and data flow.

---

## Fundamental rule

**The domain never knows about infrastructure.** The external API (Figma, GitHub, database, etc.) is an adapter that implements a port. The domain never imports an adapter.

### Dependency flow

```
entryPoint → UseCase → Aggregate/Entity/VO (pure domain)
                ↓
              Port (interface)
                ↑
            Adapter (prod: external API, test: InMemory)
```

---

## Module structure

```
src/
├── entryPoint.ts                          # Entry point — orchestrates use cases
├── modules/
│   ├── {boundedContext}/                   # Bounded context
│   │   ├── {entity}.ts                    # Entity
│   │   ├── {valueObject}.ts               # Value Object
│   │   ├── {aggregate}.ts                 # Aggregate root
│   │   └── {feature}/                     # Use case (vertical slice)
│   │       ├── {feature}.useCase.ts
│   │       ├── {feature}.{portName}.ts    # Port (interface)
│   │       ├── {feature}.figma{PortName}.ts  # Prod adapter
│   │       └── test/                      # Co-located tests
│   └── shared/
│       └── result/
│           └── commandResult.ts           # Type shared across modules
```

---

## File naming conventions

| Type | Pattern | Example |
|------|---------|---------|
| Entity | `{entity}.ts` | `element.ts`, `issuableElement.ts` |
| Value Object | `{valueObject}.ts` | `release.ts` |
| Aggregate root | `{aggregate}.ts` | `impactMapping.ts` |
| Use case | `{feature}.useCase.ts` | `analyzeImpactMap.useCase.ts` |
| Port (interface) | `{feature}.{portName}.ts` | `analyzeImpactMap.boardReader.ts` |
| Prod adapter | `{feature}.{techno}{PortName}.ts` | `analyzeImpactMap.figmaBoardReader.ts` |
| Test adapter | `{feature}.inMemory{PortName}.ts` | `analyzeImpactMap.inMemoryBoardReader.ts` |
| Test DSL | `{feature}.dsl.ts` | `analyzeImpactMap.dsl.ts` |
| Raw types (DTOs) | in the port file | types in `analyzeImpactMap.boardReader.ts` |

---

## Ports

Single interface per use case. Defines raw types (DTOs) in the same file.

```typescript
// analyzeImpactMap.boardReader.ts
export type RawConnector = { startNodeId: string; endNodeId: string };
export type RawBoardData = { shapes: RawShapeWithBounds[]; connectors: RawConnector[]; sections: RawSectionData[] };

export interface AnalyzeImpactMapBoardReader {
  readBoard(): RawBoardData;
}
```

### Port rules

- Port types are simple DTOs (not domain objects)
- One port per use case (no port shared between use cases)
- The port is in the use case folder, not in the domain

---

## Use Case

Thin orchestrator. Dependency injection via constructor. Returns `CommandResult<string>`.

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

### Use case rules

- **No business logic** in the use case — delegate to aggregates/entities
- **No `try/catch`** unless the port can throw (external adapter)
- Injection via constructor, no DI framework
- Single `execute()` method

---

## CommandResult

Shared type for results that can fail.

```typescript
CommandResult.success(value?)    // success with optional value
CommandResult.failure(error)     // failure with error message
result.isSuccess() / isFailure()
result.getValue<T>()
result.getError()
```

---

## Communication between bounded contexts

Bounded contexts communicate via JSON (contract). No direct dependency between domains.

```
contextA.toJson() → JSON → contextB.execute(json)
```

---

## Cross-cutting rules

- **No barrel files** (`index.ts`) — direct imports to the source file
- **No `any`** — strict TypeScript
- **No abstract classes** — composition via interfaces (ports)
- **NEVER ports in the domain model**: entities and VOs must **never** import or receive port interfaces (repository, hasher, provider, etc.). The model only receives **final values** (strings, numbers, dates, other VOs). The **use case** calls the ports and passes the results to the model.
