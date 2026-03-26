import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';
import {
  MSSQLServerContainer,
  StartedMSSQLServerContainer,
} from '@testcontainers/mssqlserver';

interface TestAppOptions {
  withLegacyDatabase?: boolean;
}

export class TestApp {
  private constructor(
    readonly app: INestApplication,
    private readonly pgContainer: StartedPostgreSqlContainer,
    private readonly mailpitContainer: StartedTestContainer,
    private readonly mssqlContainer?: StartedMSSQLServerContainer,
  ) {}

  static async start(options?: TestAppOptions): Promise<TestApp> {
    const withLegacy = options?.withLegacyDatabase ?? false;

    const containers: [
      Promise<StartedPostgreSqlContainer>,
      Promise<StartedTestContainer>,
      Promise<StartedMSSQLServerContainer>?,
    ] = [
      new PostgreSqlContainer('postgres:16-alpine').start(),
      new GenericContainer('axllent/mailpit:latest')
        .withExposedPorts(1025, 8025)
        .start(),
    ];

    if (withLegacy) {
      containers.push(
        new MSSQLServerContainer('mcr.microsoft.com/mssql/server:2022-latest')
          .acceptLicense()
          .start(),
      );
    }

    const [pgContainer, mailpitContainer, mssqlContainer] = await Promise.all(
      containers,
    );

    process.env.POSTGRES_HOST = pgContainer.getHost();
    process.env.POSTGRES_PORT = pgContainer.getPort().toString();
    process.env.POSTGRES_USER = pgContainer.getUsername();
    process.env.POSTGRES_PASSWORD = pgContainer.getPassword();
    process.env.POSTGRES_DB = pgContainer.getDatabase();

    process.env.SMTP_HOST = mailpitContainer.getHost();
    process.env.SMTP_PORT = mailpitContainer.getMappedPort(1025).toString();

    if (mssqlContainer) {
      process.env.MSSQL_LEGACY_HOST = mssqlContainer.getHost();
      process.env.MSSQL_LEGACY_PORT = mssqlContainer.getPort().toString();
      process.env.MSSQL_LEGACY_USER = mssqlContainer.getUsername();
      process.env.MSSQL_LEGACY_PASSWORD = mssqlContainer.getPassword();
      process.env.MSSQL_LEGACY_DB = 'master';
    } else {
      delete process.env.MSSQL_LEGACY_HOST;
    }

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    return new TestApp(app, pgContainer, mailpitContainer, mssqlContainer);
  }

  get mailpitApiUrl(): string {
    const host = this.mailpitContainer.getHost();
    const port = this.mailpitContainer.getMappedPort(8025);
    return `http://${host}:${port}`;
  }

  async stopDatabase(): Promise<void> {
    await this.pgContainer?.stop();
  }

  async cleanup(): Promise<void> {
    await this.app?.close();
    await this.pgContainer?.stop();
    await this.mailpitContainer?.stop();
    await this.mssqlContainer?.stop();
  }
}
