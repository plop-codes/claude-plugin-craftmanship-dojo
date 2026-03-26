import { CommandResult } from '@src/shared/result/commandResult';
import { UUID } from '@src/shared/uuid/uuid';
import { PlainPassword } from '@src/generic/identityAndAccessManagement/shared/plainPassword.vo';
import { HashedPassword } from '@src/generic/identityAndAccessManagement/shared/hashedPassword.vo';
import { UserAccountId } from '@src/generic/identityAndAccessManagement/shared/userAccountId.vo';
import { Email } from '@src/generic/identityAndAccessManagement/shared/userAcountEmail.vo';
import type { EmailValidationError } from '@src/generic/identityAndAccessManagement/shared/userAcountEmail.vo';
import { Role } from '@src/generic/identityAndAccessManagement/shared/userAccountRole.vo';
import type { RoleValidationError } from '@src/generic/identityAndAccessManagement/shared/userAccountRole.vo';

export type UserAccountValidationError =
  | EmailValidationError
  | RoleValidationError;

export class UserAccount {
  private constructor(
    readonly id: UserAccountId,
    public email: Email,
    public role: Role,
    public hashedPassword: HashedPassword,
    public deletedAt: Date | null = null,
  ) {}

  archive(date: Date): void {
    this.deletedAt = date;
  }

  static generatePassword(): PlainPassword {
    return PlainPassword.create();
  }

  createNewPassword(): PlainPassword {
    return PlainPassword.create();
  }

  updatePassword(hashedPassword: HashedPassword): void {
    this.hashedPassword = hashedPassword;
  }

  modify(
    email: string,
    role: string,
  ): CommandResult<UserAccountValidationError> {
    const emailResult = Email.create(email);
    if (emailResult.isFailure()) {
      return CommandResult.failure(emailResult.getError());
    }

    const roleResult = Role.create(role);
    if (roleResult.isFailure()) {
      return CommandResult.failure(roleResult.getError());
    }

    this.email = emailResult.getValue<Email>();
    this.role = roleResult.getValue<Role>();

    return CommandResult.success();
  }

  static reconstitute(
    id: UUID,
    email: string,
    role: string,
    hashedPassword: string,
  ): UserAccount {
    return new UserAccount(
      UserAccountId.from(id),
      Email.from(email),
      Role.from(role),
      HashedPassword.from(hashedPassword),
    );
  }

  static create(
    email: string,
    role: string,
    hashedPassword: HashedPassword,
  ): CommandResult<UserAccountValidationError> {
    const emailResult = Email.create(email);
    if (emailResult.isFailure()) {
      return CommandResult.failure(emailResult.getError());
    }

    const roleResult = Role.create(role);
    if (roleResult.isFailure()) {
      return CommandResult.failure(roleResult.getError());
    }

    const userAccount = new UserAccount(
      UserAccountId.generate(),
      emailResult.getValue<Email>(),
      roleResult.getValue<Role>(),
      hashedPassword,
    );
    return CommandResult.success(userAccount);
  }
}
