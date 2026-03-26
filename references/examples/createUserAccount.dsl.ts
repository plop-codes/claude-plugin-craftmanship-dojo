export interface ValidCreationDSL {
  givenSystemIsOperational(): Promise<void> | void;
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void>;
  thenAccountIsCreatedWith(expected: {
    email: string;
    role: string;
  }): Promise<void> | void;
  thenAccountHasAValidUUID(): Promise<void> | void;
}

export interface InvalidEmailRejectedDSL {
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWithInvalidEmail(email: string): Promise<void>;
  thenAccountIsNotCreated(): void;
  thenImInformedOfError(expectedError: string): void;
}

export interface InvalidRoleRejectedDSL {
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWithInvalidRole(role: string): Promise<void>;
  thenAccountIsNotCreated(): void;
  thenImInformedOfError(expectedError: string): void;
}

export interface DuplicateEmailRejectedDSL {
  givenImAuthenticatedAsDSI(): void;
  givenAccountExistsWithEmail(email: string): void;
  whenICreateAccountWithEmail(email: string): Promise<void>;
  thenAccountIsNotCreated(): void;
  thenImInformedOfError(expectedError: string): void;
}

export interface PasswordGeneratedDSL {
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void>;
  thenPasswordIsGenerated(): void;
  thenPasswordContains(expected: {
    textChars: number;
    digits: number;
    specialChars: number;
  }): void;
}

export interface PasswordHashedDSL {
  givenSystemIsOperational(): Promise<void> | void;
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void>;
  thenAccountIsCreated(): void;
  thenPasswordIsStoredHashed(): void;
}

export interface MissingEmailRejectedDSL {
  givenSystemIsOperational(): Promise<void> | void;
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWithoutEmail(): Promise<void>;
  thenAccountIsNotCreated(): Promise<void> | void;
  thenImInformedOfError(expectedError: string): void;
}

export interface MissingRoleRejectedDSL {
  givenSystemIsOperational(): Promise<void> | void;
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWithoutRole(): Promise<void>;
  thenAccountIsNotCreated(): Promise<void> | void;
  thenImInformedOfError(expectedError: string): void;
}

export interface SaveErrorDSL {
  givenSystemIsOperational(): Promise<void> | void;
  givenImAuthenticatedAsDSI(): void;
  givenDatabaseIsDown(): Promise<void> | void;
  whenICreateAccountWithValidData(): Promise<void>;
  thenAccountIsNotCreated(): void;
  thenImInformedOfError(expectedError: string): void;
}

export interface PasswordSentByEmailDSL {
  givenSystemIsOperational(): Promise<void> | void;
  givenImAuthenticatedAsDSI(): void;
  whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void>;
  thenAnEmailIsSentTo(email: string): void | Promise<void>;
  thenEmailContainsPasswordInPlainText(): void | Promise<void>;
}
