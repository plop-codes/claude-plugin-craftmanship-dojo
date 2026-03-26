# Proposition 8 : Pas d'ORM pour les lectures

## References necessaires

Aucune reference embarquee specifique. Inspecter le code du developpeur.

## Instructions

**Inspecter** : si la feature contient une query/lecture, est-ce qu'elle utilise `Repository<Entity>.find()` / `Repository<Entity>.findOne()` (TypeORM) ou du SQL direct via `DataSource.query()` ?

**Skip si** : la feature est write-only (creation, modification, suppression) ou utilise deja du SQL direct.

**Pourquoi** :
- Pour les **lectures**, on n'a pas besoin de mapper vers des entites de domaine — on veut des **view models** (projections simples).
- Le SQL direct est plus **simple** (pas de configuration de relations, pas de `@OneToMany`, pas de lazy loading surprises) et plus **performant** (requete optimisee, pas de N+1).
- Le repository TypeORM reste pertinent pour les **ecritures** (il gere les transactions, le cascade, le tracking des changements).

**Exemple** : montrer le pattern :
```typescript
@Injectable()
export class FeatureSqlRepository implements FeatureRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<ViewModel | null> {
    const rows = await this.dataSource.query('SELECT ... FROM ... WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return { /* mapping simple */ };
  }
}
```

**STOP** — attendre decision
