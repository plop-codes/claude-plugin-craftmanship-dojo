# DDD Domain Modeling Patterns

Patterns et conventions de modelisation domaine. Consulter AVANT de creer ou modifier une entite, un value object, un aggregate ou un use case.

---

## Entite

Objet avec identite. `private constructor` (simple assignement) + factory statique `create()`. Proprietes `readonly`. Les validations metier sont portees par des **Value Objects** dedies (voir section VO ci-dessous). L'entite agregre les VOs et son type d'erreur est un **type union** des erreurs de chaque VO.

**JAMAIS de ports dans le model** : les entites et VOs ne recoivent que des **valeurs finales** (strings, numbers, dates, autres VOs), jamais d'interfaces de port. C'est le **use case** qui appelle les ports et passe les resultats au model.

```typescript
import { Email } from './email';
import type { EmailValidationError } from './email';
import { Role } from './role';
import type { RoleValidationError } from './role';

// Type union des erreurs VO (pas un enum unique)
export type UserAccountValidationError =
  | EmailValidationError
  | RoleValidationError;

export class UserAccount {
  readonly email: Email;
  readonly role: Role;

  // Constructor = simple assignement, pas de logique
  private constructor(email: Email, role: Role) {
    this.email = email;
    this.role = role;
  }

  // Factory — appelle chaque VO, propage l'erreur si echec
  static create(
    email: string,
    role: string,
  ): CommandResult<UserAccountValidationError> {
    const emailResult = Email.create(email);
    if (emailResult.isFailure()) {
      return CommandResult.failure<UserAccountValidationError>(emailResult.getError());
    }

    const roleResult = Role.create(role);
    if (roleResult.isFailure()) {
      return CommandResult.failure<UserAccountValidationError>(roleResult.getError());
    }

    return CommandResult.success(new UserAccount(
      emailResult.getValue<Email>(),
      roleResult.getValue<Role>(),
    ));
  }
}
```

### Trois types de factory

| Pattern | Retour | Quand l'utiliser |
|---------|--------|------------------|
| Factory avec validation metier (`create`) | `CommandResult<ValidationError>` | Donnees utilisateur qui peuvent violer des regles metier. L'erreur est un enum metier explicite. |
| Factory de reconstitution (`reconstitute`) | `T` | Reconstitution depuis des donnees de confiance (DB). Utilise `VO.from()` sur chaque VO, pas de validation. |
| Factory filtrante | `T \| undefined` | Donnees brutes qui peuvent etre invalides. `undefined` = "pas un element valide", pas une erreur. |

```typescript
// Reconstitution depuis la DB — pas de validation, utilise VO.from()
static reconstitute(id: UUID, email: string, role: string, ...): UserAccount {
  return new UserAccount(
    UserAccountId.from(id),
    Email.from(email),
    Role.from(role),
    ...
  );
}
```

---

## Value Object

Objet sans identite, defini par ses valeurs. `private constructor` + `readonly value` + factory statique.

### VO avec validation metier (pattern principal)

Chaque propriete ayant une regle metier est un VO dedie avec son propre **enum** d'erreur et `static create()` retournant `CommandResult<VoValidationError>`. Chaque VO expose aussi `static from(value)` pour la reconstitution depuis des donnees de confiance (DB).

```typescript
export enum EmailValidationError {
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
}

export class Email {
  readonly value: string;

  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    this.value = value;
  }

  // Reconstitution depuis donnees de confiance (DB) — pas de validation
  static from(value: string): Email {
    return new Email(value);
  }

  // Creation avec validation metier — donnees utilisateur
  static create(value: string): CommandResult<EmailValidationError> {
    if (!Email.EMAIL_REGEX.test(value)) {
      return CommandResult.failure(EmailValidationError.INVALID_EMAIL_FORMAT);
    }
    return CommandResult.success(new Email(value));
  }
}
```

### VO simple (sans validation)

Pour encapsuler une valeur sans regle metier de validation. `private constructor` + factory statique. Peut contenir de la logique de generation.

```typescript
// VO generateur (ex: PlainPassword)
export class PlainPassword {
  private constructor(readonly value: string) {}

  static create(): PlainPassword {
    // logique de generation
    return new PlainPassword(generatedValue);
  }
}

// VO wrapper (ex: HashedPassword)
export class HashedPassword {
  private constructor(readonly value: string) {}

  static create(value: string): HashedPassword {
    return new HashedPassword(value);
  }
}
```

L'aggregate root orchestre les VOs simples via des methodes dediees :

```typescript
export class UserAccount {
  // generatePassword() et createNewPassword() appellent PlainPassword.create()
  // Le use case hash via le port, puis passe le HashedPassword a create() ou updatePassword()
  static generatePassword(): PlainPassword { return PlainPassword.create(); }
  createNewPassword(): PlainPassword { return PlainPassword.create(); }
  updatePassword(hashedPassword: HashedPassword): void { this.hashedPassword = hashedPassword; }
}
```

### VO filtrant (pattern secondaire)

Pour les donnees brutes qui peuvent etre invalides. `undefined` = "pas un element valide", pas une erreur.

```typescript
export class Release {
  readonly releaseName: string;
  private readonly bounds: Bounds;

  private constructor(name: string, bounds: Bounds) {
    this.releaseName = name;
    this.bounds = bounds;
  }

  static identifyFromSection(section: { ... }): Release | undefined {
    if (!section.name.trim()) return undefined;
    return new Release(section.name, { ... });
  }
}
```

---

## Aggregate Root

Point d'entree unique pour un ensemble coherent d'entites/value objects. Orchestre la validation des invariants sur l'ensemble, la construction des relations, et les transformations.

### Regle fondamentale : TOUJOURS passer par l'aggregate root

**JAMAIS acceder directement aux Value Objects depuis le use case pour modifier l'etat de l'aggregate.** Toute mutation d'etat (creation, mise a jour) doit passer par une methode de l'aggregate root.

```typescript
// INTERDIT — le use case manipule le VO directement :
const plainPassword = PlainPassword.create();
await repository.updateHashedPassword(email, hash);

// CORRECT — le use case passe par l'aggregate root :
const userAccount = await repository.findByEmail(email);
const plainPassword = userAccount.createNewPassword();
const hashedPassword = passwordHasher.hash(plainPassword);
userAccount.updatePassword(hashedPassword);
await repository.save(userAccount);
```

**Consequences sur le repository** : le repository expose `findById`/`findByEmail` + `save`, jamais de methodes qui modifient directement un champ (`updateField`). L'etat change via l'aggregate, puis l'aggregate est sauvegarde.

---

## Assertions de validation metier

### Dans les Value Objects (CommandResult.failure) — pour les validations metier sur les champs

Chaque propriete avec regle metier est un VO dedie. La validation est dans le VO, pas dans l'entite :

```typescript
// Dans le VO (email.ts)
static create(value: string): CommandResult<EmailValidationError> {
  if (!Email.EMAIL_REGEX.test(value)) {
    return CommandResult.failure(EmailValidationError.INVALID_EMAIL_FORMAT);
  }
  return CommandResult.success(new Email(value));
}
```

L'entite appelle chaque VO et propage les erreurs :
```typescript
// Dans l'entite (userAccount.ts)
static create(email: string, role: string): CommandResult<UserAccountValidationError> {
  const emailResult = Email.create(email);
  if (emailResult.isFailure()) {
    return CommandResult.failure<UserAccountValidationError>(emailResult.getError());
  }

  const roleResult = Role.create(role);
  if (roleResult.isFailure()) {
    return CommandResult.failure<UserAccountValidationError>(roleResult.getError());
  }

  return CommandResult.success(new UserAccount(
    emailResult.getValue<Email>(),
    roleResult.getValue<Role>(),
  ));
}
```

---

## Resume des patterns

| Concept | Constructeur | Factory | Retour factory | Invariants |
|---------|-------------|---------|----------------|------------|
| Value Object (validation) | `private` (assignement) | `static create()` | `CommandResult<VoValidationError>` | validation dans `create()`, propre enum d'erreur |
| Value Object (simple) | `private` (assignement) | `static create()` | `T` (toujours valide) | pas de validation, encapsule une valeur ou genere |
| Value Object (filtrant) | `private` (assignement) | `static identifyFrom...()` | `T \| undefined` | filtre dans factory |
| Entite (avec VOs) | `private` (assignement) | `static create()` | `CommandResult<TypeUnionVoErrors>` | appelle chaque VO, propage les erreurs |
| Aggregate root | `private` (assignation) | `static from...()` / `static generateFrom...()` | `CommandResult<string>` | `assertXxx` → `CommandResult.failure` |
| Aggregate collection | `private` (assignation) | `static from...()` | `T` (toujours valide) | delegue aux entites |
| Use Case | `constructor(port)` | — | `CommandResult<E>` | orchestre ports + model (JAMAIS de ports dans le model) |
