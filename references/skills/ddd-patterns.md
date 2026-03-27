# DDD Domain Modeling Patterns

Domain modeling patterns and conventions. Consult BEFORE creating or modifying an entity, value object, aggregate, or use case.

---

## Entity

Object with identity. `private constructor` (simple assignment) + `create()` static factory. `readonly` properties. Business validations are carried by dedicated **Value Objects** (see VO section below). The entity aggregates VOs and its error type is a **type union** of each VO's errors.

**NEVER ports in the model**: entities and VOs only receive **final values** (strings, numbers, dates, other VOs), never port interfaces. The **use case** calls the ports and passes the results to the model.

```typescript
import { Email } from './email';
import type { EmailValidationError } from './email';
import { Role } from './role';
import type { RoleValidationError } from './role';

// Type union of VO errors (not a single enum)
export type UserAccountValidationError =
  | EmailValidationError
  | RoleValidationError;

export class UserAccount {
  readonly email: Email;
  readonly role: Role;

  // Constructor = simple assignment, no logic
  private constructor(email: Email, role: Role) {
    this.email = email;
    this.role = role;
  }

  // Factory — calls each VO, propagates error on failure
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

### Three types of factories

| Pattern | Return | When to use |
|---------|--------|-------------|
| Factory with business validation (`create`) | `CommandResult<ValidationError>` | User data that can violate business rules. The error is an explicit business enum. |
| Reconstitution factory (`reconstitute`) | `T` | Reconstitution from trusted data (DB). Uses `VO.from()` on each VO, no validation. |
| Filtering factory | `T \| undefined` | Raw data that may be invalid. `undefined` = "not a valid element", not an error. |

```typescript
// Reconstitution from DB — no validation, uses VO.from()
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

Object without identity, defined by its values. `private constructor` + `readonly value` + static factory.

### VO with business validation (main pattern)

Each property with a business rule is a dedicated VO with its own error **enum** and `static create()` returning `CommandResult<VoValidationError>`. Each VO also exposes `static from(value)` for reconstitution from trusted data (DB).

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

  // Reconstitution from trusted data (DB) — no validation
  static from(value: string): Email {
    return new Email(value);
  }

  // Creation with business validation — user data
  static create(value: string): CommandResult<EmailValidationError> {
    if (!Email.EMAIL_REGEX.test(value)) {
      return CommandResult.failure(EmailValidationError.INVALID_EMAIL_FORMAT);
    }
    return CommandResult.success(new Email(value));
  }
}
```

### Simple VO (without validation)

To encapsulate a value without business validation rules. `private constructor` + static factory. May contain generation logic.

```typescript
// Generator VO (e.g., PlainPassword)
export class PlainPassword {
  private constructor(readonly value: string) {}

  static create(): PlainPassword {
    // generation logic
    return new PlainPassword(generatedValue);
  }
}

// Wrapper VO (e.g., HashedPassword)
export class HashedPassword {
  private constructor(readonly value: string) {}

  static create(value: string): HashedPassword {
    return new HashedPassword(value);
  }
}
```

The aggregate root orchestrates simple VOs via dedicated methods:

```typescript
export class UserAccount {
  // generatePassword() and createNewPassword() call PlainPassword.create()
  // The use case hashes via the port, then passes the HashedPassword to create() or updatePassword()
  static generatePassword(): PlainPassword { return PlainPassword.create(); }
  createNewPassword(): PlainPassword { return PlainPassword.create(); }
  updatePassword(hashedPassword: HashedPassword): void { this.hashedPassword = hashedPassword; }
}
```

### Filtering VO (secondary pattern)

For raw data that may be invalid. `undefined` = "not a valid element", not an error.

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

Single entry point for a coherent set of entities/value objects. Orchestrates invariant validation on the set, relationship construction, and transformations.

### Fundamental rule: ALWAYS go through the aggregate root

**NEVER access Value Objects directly from the use case to modify the aggregate's state.** Any state mutation (creation, update) must go through an aggregate root method.

```typescript
// FORBIDDEN — the use case manipulates the VO directly:
const plainPassword = PlainPassword.create();
await repository.updateHashedPassword(email, hash);

// CORRECT — the use case goes through the aggregate root:
const userAccount = await repository.findByEmail(email);
const plainPassword = userAccount.createNewPassword();
const hashedPassword = passwordHasher.hash(plainPassword);
userAccount.updatePassword(hashedPassword);
await repository.save(userAccount);
```

**Consequences on the repository**: the repository exposes `findById`/`findByEmail` + `save`, never methods that directly modify a field (`updateField`). State changes via the aggregate, then the aggregate is saved.

---

## Business validation assertions

### In Value Objects (CommandResult.failure) — for business validations on fields

Each property with a business rule is a dedicated VO. Validation is in the VO, not in the entity:

```typescript
// In the VO (email.ts)
static create(value: string): CommandResult<EmailValidationError> {
  if (!Email.EMAIL_REGEX.test(value)) {
    return CommandResult.failure(EmailValidationError.INVALID_EMAIL_FORMAT);
  }
  return CommandResult.success(new Email(value));
}
```

The entity calls each VO and propagates errors:
```typescript
// In the entity (userAccount.ts)
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

## Pattern summary

| Concept | Constructor | Factory | Factory return | Invariants |
|---------|-------------|---------|----------------|------------|
| Value Object (validation) | `private` (assignment) | `static create()` | `CommandResult<VoValidationError>` | validation in `create()`, own error enum |
| Value Object (simple) | `private` (assignment) | `static create()` | `T` (always valid) | no validation, wraps a value or generates |
| Value Object (filtering) | `private` (assignment) | `static identifyFrom...()` | `T \| undefined` | filter in factory |
| Entity (with VOs) | `private` (assignment) | `static create()` | `CommandResult<TypeUnionVoErrors>` | calls each VO, propagates errors |
| Aggregate root | `private` (assignment) | `static from...()` / `static generateFrom...()` | `CommandResult<string>` | `assertXxx` → `CommandResult.failure` |
| Aggregate collection | `private` (assignment) | `static from...()` | `T` (always valid) | delegates to entities |
| Use Case | `constructor(port)` | — | `CommandResult<E>` | orchestrates ports + model (NEVER ports in the model) |
