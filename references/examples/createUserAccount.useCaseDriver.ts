import { expect } from 'vitest';
import type {
  ValidCreationDSL,
  InvalidEmailRejectedDSL,
  InvalidRoleRejectedDSL,
  DuplicateEmailRejectedDSL,
  PasswordGeneratedDSL,
  PasswordHashedDSL,
  SaveErrorDSL,
  PasswordSentByEmailDSL,
} from '@src/generic/identityAndAccessManagement/createUserAccount/test/createUserAccount.dsl';
import { FakeEmailSender } from '@src/generic/identityAndAccessManagement/createUserAccount/test/createUserAccount.fakeEmailSender';
import { CreateUserAccountUseCase } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.useCase';
import { UserAccount } from '@src/generic/identityAndAccessManagement/shared/userAccount.entity';
import { HashedPassword } from '@src/generic/identityAndAccessManagement/shared/hashedPassword.vo';
import { CreateUserAccountInMemoryUserAccountRepository } from '@src/generic/identityAndAccessManagement/createUserAccount/test/createUserAccount.inMemoryRepository';
import type { CommandResult } from '@src/shared/result/commandResult';
import type { CreateUserAccountErrors } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.useCase';
import { fakePasswordHasher } from '@src/generic/identityAndAccessManagement/createUserAccount/test/createUserAccount.fakePasswordHasher';

export class ValidCreationUseCaseDriver implements ValidCreationDSL {
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    new FakeEmailSender(),
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenSystemIsOperational(): void {
    // No setup needed for unit tests
  }

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  async whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void> {
    this.result = await this.useCase.execute(createAccountCommand);
  }

  thenAccountIsCreatedWith(expected: { email: string; role: string }): void {
    expect(this.result.isSuccess()).toBe(true);
    expect(this.repository.userAccounts).toHaveLength(1);
    const account = this.repository.userAccounts[0];
    expect(account.email.value).toBe(expected.email);
    expect(account.role.value).toBe(expected.role);
  }

  thenAccountHasAValidUUID(): void {
    const account = this.repository.userAccounts[0];
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect(account.id).toBeDefined();
    expect(account.id.value).toMatch(uuidRegex);
  }
}

export class InvalidEmailRejectedUseCaseDriver
  implements InvalidEmailRejectedDSL
{
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    new FakeEmailSender(),
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  async whenICreateAccountWithInvalidEmail(email: string): Promise<void> {
    this.result = await this.useCase.execute({
      email,
      role: 'ADV',
    });
  }

  thenAccountIsNotCreated(): void {
    expect(this.result.isFailure()).toBe(true);
    expect(this.repository.userAccounts).toHaveLength(0);
  }

  thenImInformedOfError(expectedError: string): void {
    expect(this.result.getError()).toBe(expectedError);
  }
}

export class InvalidRoleRejectedUseCaseDriver
  implements InvalidRoleRejectedDSL
{
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    new FakeEmailSender(),
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  async whenICreateAccountWithInvalidRole(role: string): Promise<void> {
    this.result = await this.useCase.execute({
      email: 'dupont.gerard@test.com',
      role,
    });
  }

  thenAccountIsNotCreated(): void {
    expect(this.result.isFailure()).toBe(true);
    expect(this.repository.userAccounts).toHaveLength(0);
  }

  thenImInformedOfError(expectedError: string): void {
    expect(this.result.getError()).toBe(expectedError);
  }
}

export class DuplicateEmailRejectedUseCaseDriver
  implements DuplicateEmailRejectedDSL
{
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    new FakeEmailSender(),
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  givenAccountExistsWithEmail(email: string): void {
    const existingAccount = UserAccount.create(
      email,
      'ADV',
      HashedPassword.create('hashed_existing'),
    );
    this.repository.userAccounts.push(existingAccount.getValue<UserAccount>());
  }

  async whenICreateAccountWithEmail(email: string): Promise<void> {
    this.result = await this.useCase.execute({
      email,
      role: 'ADV',
    });
  }

  thenAccountIsNotCreated(): void {
    expect(this.result.isFailure()).toBe(true);
    expect(this.repository.userAccounts).toHaveLength(1);
  }

  thenImInformedOfError(expectedError: string): void {
    expect(this.result.getError()).toBe(expectedError);
  }
}

export class PasswordGeneratedUseCaseDriver implements PasswordGeneratedDSL {
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private emailSender = new FakeEmailSender();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    this.emailSender,
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  async whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void> {
    this.result = await this.useCase.execute(createAccountCommand);
  }

  thenPasswordIsGenerated(): void {
    expect(this.result.isSuccess()).toBe(true);
    expect(this.emailSender.sentEmails).toHaveLength(1);
    expect(this.emailSender.sentEmails[0].password).toBeDefined();
    expect(this.emailSender.sentEmails[0].password).not.toBe('');
  }

  thenPasswordContains(expected: {
    textChars: number;
    digits: number;
    specialChars: number;
  }): void {
    const password = this.emailSender.sentEmails[0].password;
    const textChars = password.replace(/[^a-zA-Z]/g, '').length;
    const digits = password.replace(/[^0-9]/g, '').length;
    const specialChars = password.replace(/[a-zA-Z0-9]/g, '').length;
    expect(textChars).toBe(expected.textChars);
    expect(digits).toBe(expected.digits);
    expect(specialChars).toBe(expected.specialChars);
  }
}

export class PasswordHashedUseCaseDriver implements PasswordHashedDSL {
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private emailSender = new FakeEmailSender();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    this.emailSender,
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenSystemIsOperational(): void {
    // No setup needed for unit tests
  }

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  async whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void> {
    this.result = await this.useCase.execute(createAccountCommand);
  }

  thenAccountIsCreated(): void {
    expect(this.result.isSuccess()).toBe(true);
    expect(this.repository.userAccounts).toHaveLength(1);
  }

  thenPasswordIsStoredHashed(): void {
    const account = this.repository.userAccounts[0];
    const plainPassword = this.emailSender.sentEmails[0].password;
    expect(account.hashedPassword).toBeDefined();
    expect(account.hashedPassword.value).not.toBe('');
    expect(account.hashedPassword.value).not.toBe(plainPassword);
  }
}

export class PasswordSentByEmailUseCaseDriver
  implements PasswordSentByEmailDSL
{
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private emailSender = new FakeEmailSender();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    this.emailSender,
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenSystemIsOperational(): void {
    // No setup needed for unit tests
  }

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  async whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void> {
    this.result = await this.useCase.execute(createAccountCommand);
  }

  thenAnEmailIsSentTo(email: string): void {
    expect(this.result.isSuccess()).toBe(true);
    expect(this.emailSender.sentEmails).toHaveLength(1);
    expect(this.emailSender.sentEmails[0].to).toBe(email);
  }

  thenEmailContainsPasswordInPlainText(): void {
    const sentEmail = this.emailSender.sentEmails[0];
    expect(sentEmail.password).toBeDefined();
    expect(sentEmail.password).not.toBe('');
    // Le mot de passe envoyé doit être en clair (pas le hash)
    expect(sentEmail.password).not.toMatch(/^hashed_/);
  }
}

export class SaveErrorUseCaseDriver implements SaveErrorDSL {
  private repository = new CreateUserAccountInMemoryUserAccountRepository();
  private useCase = new CreateUserAccountUseCase(
    this.repository,
    fakePasswordHasher,
    new FakeEmailSender(),
  );
  private result!: CommandResult<CreateUserAccountErrors>;

  givenSystemIsOperational(): void {
    // No setup needed for unit tests
  }

  givenImAuthenticatedAsDSI(): void {
    // No setup needed for unit tests — user role is not enforced yet
  }

  givenDatabaseIsDown(): void {
    this.repository.simulateDatabaseDown();
  }

  async whenICreateAccountWithValidData(): Promise<void> {
    this.result = await this.useCase.execute({
      email: 'dupont.gerard@test.com',
      role: 'ADV',
    });
  }

  thenAccountIsNotCreated(): void {
    expect(this.result.isFailure()).toBe(true);
    expect(this.repository.userAccounts).toHaveLength(0);
  }

  thenImInformedOfError(expectedError: string): void {
    expect(this.result.getError()).toBe(expectedError);
  }
}
