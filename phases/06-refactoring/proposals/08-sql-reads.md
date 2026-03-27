# Proposal 8: No ORM for reads

## Required references

No specific bundled reference. Inspect the developer's code.

## Instructions

**Inspect**: if the feature contains a query/read, does it use `Repository<Entity>.find()` / `Repository<Entity>.findOne()` (TypeORM) or direct SQL via `DataSource.query()`?

**Skip if**: the feature is write-only (create, update, delete) or already uses direct SQL.

**Why**:
- For **reads**, you don't need to map to domain entities — you want **view models** (simple projections).
- Direct SQL is **simpler** (no relationship configuration, no `@OneToMany`, no lazy loading surprises) and more **performant** (optimized query, no N+1).
- The TypeORM repository remains relevant for **writes** (it handles transactions, cascade, change tracking).

**Example**: show the pattern:
```typescript
@Injectable()
export class FeatureSqlRepository implements FeatureRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<ViewModel | null> {
    const rows = await this.dataSource.query('SELECT ... FROM ... WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return { /* simple mapping */ };
  }
}
```

**STOP** — wait for decision
