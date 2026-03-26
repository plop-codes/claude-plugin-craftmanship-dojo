import request from 'supertest';
import { expect } from 'vitest';
import { DataSource } from 'typeorm';
import { TestApp } from '@src/shared/test/e2e/testApp';
import type {
  ValidCreationDSL,
  MissingEmailRejectedDSL,
  MissingRoleRejectedDSL,
  SaveErrorDSL,
  PasswordHashedDSL,
  PasswordSentByEmailDSL,
} from '@src/generic/identityAndAccessManagement/createUserAccount/test/createUserAccount.dsl';

export class ValidCreationE2eDriver implements ValidCreationDSL {
  private testApp!: TestApp;
  private response!: request.Response;

  async givenSystemIsOperational() {
    this.testApp = await TestApp.start();
  }

  givenImAuthenticatedAsDSI() {
    // No setup needed — user role is not enforced yet
  }

  async whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void> {
    this.response = await request(this.testApp.app.getHttpServer())
      .post('/api/identity-and-access-management/create-user-account')
      .send(createAccountCommand);
  }

  async thenAccountIsCreatedWith(expected: {
    email: string;
    role: string;
  }): Promise<void> {
    expect(this.response.status).toBe(201);
    const dataSource = this.testApp.app.get(DataSource);
    const rows = await dataSource.query(
      'SELECT * FROM user_accounts WHERE email = $1',
      [expected.email],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe(expected.email);
    expect(rows[0].role).toBe(expected.role);
  }

  async thenAccountHasAValidUUID(): Promise<void> {
    const dataSource = this.testApp.app.get(DataSource);
    const rows = await dataSource.query('SELECT * FROM user_accounts');
    expect(rows).toHaveLength(1);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect(rows[0].id).toMatch(uuidRegex);
  }

  async cleanup() {
    await this.testApp?.cleanup();
  }
}

export class MissingEmailRejectedE2eDriver implements MissingEmailRejectedDSL {
  private testApp!: TestApp;
  private response!: request.Response;

  async givenSystemIsOperational() {
    this.testApp = await TestApp.start();
  }

  givenImAuthenticatedAsDSI() {
    // No setup needed — user role is not enforced yet
  }

  async whenICreateAccountWithoutEmail(): Promise<void> {
    this.response = await request(this.testApp.app.getHttpServer())
      .post('/api/identity-and-access-management/create-user-account')
      .send({
        role: 'ADV',
      });
  }

  async thenAccountIsNotCreated(): Promise<void> {
    expect(this.response.status).toBe(400);
    const dataSource = this.testApp.app.get(DataSource);
    const rows = await dataSource.query('SELECT * FROM user_accounts');
    expect(rows).toHaveLength(0);
  }

  thenImInformedOfError(expectedError: string): void {
    expect(this.response.body).toEqual({ error: expectedError });
  }

  async cleanup() {
    await this.testApp?.cleanup();
  }
}

export class MissingRoleRejectedE2eDriver implements MissingRoleRejectedDSL {
  private testApp!: TestApp;
  private response!: request.Response;

  async givenSystemIsOperational() {
    this.testApp = await TestApp.start();
  }

  givenImAuthenticatedAsDSI() {
    // No setup needed — user role is not enforced yet
  }

  async whenICreateAccountWithoutRole(): Promise<void> {
    this.response = await request(this.testApp.app.getHttpServer())
      .post('/api/identity-and-access-management/create-user-account')
      .send({
        email: 'dupont.gerard@test.com',
      });
  }

  async thenAccountIsNotCreated(): Promise<void> {
    expect(this.response.status).toBe(400);
    const dataSource = this.testApp.app.get(DataSource);
    const rows = await dataSource.query('SELECT * FROM user_accounts');
    expect(rows).toHaveLength(0);
  }

  thenImInformedOfError(expectedError: string): void {
    expect(this.response.body).toEqual({ error: expectedError });
  }

  async cleanup() {
    await this.testApp?.cleanup();
  }
}

export class SaveErrorE2eDriver implements SaveErrorDSL {
  private testApp!: TestApp;
  private response!: request.Response;

  async givenSystemIsOperational() {
    this.testApp = await TestApp.start();
  }

  givenImAuthenticatedAsDSI() {
    // No setup needed — user role is not enforced yet
  }

  async givenDatabaseIsDown(): Promise<void> {
    await this.testApp.stopDatabase();
  }

  async whenICreateAccountWithValidData(): Promise<void> {
    this.response = await request(this.testApp.app.getHttpServer())
      .post('/api/identity-and-access-management/create-user-account')
      .send({
        email: 'dupont.gerard@test.com',
        role: 'ADV',
      });
  }

  thenAccountIsNotCreated(): void {
    expect(this.response.status).toBe(500);
  }

  thenImInformedOfError(expectedError: string): void {
    expect(this.response.body).toEqual({ error: expectedError });
  }

  async cleanup() {
    await this.testApp?.cleanup();
  }
}

export class PasswordHashedE2eDriver implements PasswordHashedDSL {
  private testApp!: TestApp;
  private response!: request.Response;

  async givenSystemIsOperational() {
    this.testApp = await TestApp.start();
  }

  givenImAuthenticatedAsDSI() {
    // No setup needed — user role is not enforced yet
  }

  async whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void> {
    this.response = await request(this.testApp.app.getHttpServer())
      .post('/api/identity-and-access-management/create-user-account')
      .send(createAccountCommand);
  }

  async thenAccountIsCreated(): Promise<void> {
    expect(this.response.status).toBe(201);
    const dataSource = this.testApp.app.get(DataSource);
    const rows = await dataSource.query('SELECT * FROM user_accounts');
    expect(rows).toHaveLength(1);
  }

  async thenPasswordIsStoredHashed(): Promise<void> {
    const dataSource = this.testApp.app.get(DataSource);
    const rows = await dataSource.query('SELECT * FROM user_accounts');
    expect(rows[0].hashed_password).toBeDefined();
    expect(rows[0].hashed_password).not.toBe('');
    expect(rows[0]).not.toHaveProperty('password');
  }

  async cleanup() {
    await this.testApp?.cleanup();
  }
}

export class PasswordSentByEmailE2eDriver implements PasswordSentByEmailDSL {
  private testApp!: TestApp;
  private response!: request.Response;

  async givenSystemIsOperational() {
    this.testApp = await TestApp.start();
  }

  givenImAuthenticatedAsDSI() {
    // No setup needed — user role is not enforced yet
  }

  async whenICreateAccountWith(createAccountCommand: {
    email: string;
    role: string;
  }): Promise<void> {
    this.response = await request(this.testApp.app.getHttpServer())
      .post('/api/identity-and-access-management/create-user-account')
      .send(createAccountCommand);
  }

  async thenAnEmailIsSentTo(email: string): Promise<void> {
    expect(this.response.status).toBe(201);

    const messagesResponse = await fetch(
      `${this.testApp.mailpitApiUrl}/api/v1/messages`,
    );
    const messages = await messagesResponse.json();
    expect(messages.messages).toHaveLength(1);
    expect(messages.messages[0].To[0].Address).toBe(email);
  }

  async thenEmailContainsPasswordInPlainText(): Promise<void> {
    const messagesResponse = await fetch(
      `${this.testApp.mailpitApiUrl}/api/v1/messages`,
    );
    const messages = await messagesResponse.json();
    const messageId = messages.messages[0].ID;

    const messageResponse = await fetch(
      `${this.testApp.mailpitApiUrl}/api/v1/message/${messageId}`,
    );
    const message = await messageResponse.json();

    expect(message.Text).toBeDefined();
    expect(message.Text).not.toBe('');
    // Le contenu ne doit pas être un hash (commence par $2b$ pour bcrypt)
    expect(message.Text).not.toMatch(/\$2[aby]\$/);
  }

  async cleanup() {
    await this.testApp?.cleanup();
  }
}
