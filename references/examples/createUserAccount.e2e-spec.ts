import { describe, test, afterEach } from 'vitest';
import {
  ValidCreationE2eDriver,
  MissingEmailRejectedE2eDriver,
  MissingRoleRejectedE2eDriver,
  SaveErrorE2eDriver,
  PasswordHashedE2eDriver,
  PasswordSentByEmailE2eDriver,
} from '@src/generic/identityAndAccessManagement/createUserAccount/test/e2e/createUserAccount.e2eDriver';

describe('Créer un compte utilisateur', () => {
  let validCreationDriver: ValidCreationE2eDriver;
  let missingEmailDriver: MissingEmailRejectedE2eDriver;
  let missingRoleDriver: MissingRoleRejectedE2eDriver;
  let saveErrorDriver: SaveErrorE2eDriver;
  let passwordHashedDriver: PasswordHashedE2eDriver;
  let passwordSentByEmailDriver: PasswordSentByEmailE2eDriver;

  afterEach(async () => {
    await validCreationDriver?.cleanup();
    await missingEmailDriver?.cleanup();
    await missingRoleDriver?.cleanup();
    await saveErrorDriver?.cleanup();
    await passwordHashedDriver?.cleanup();
    await passwordSentByEmailDriver?.cleanup();
  });

  test('création valide', async () => {
    validCreationDriver = new ValidCreationE2eDriver();

    await validCreationDriver.givenSystemIsOperational();
    validCreationDriver.givenImAuthenticatedAsDSI();

    await validCreationDriver.whenICreateAccountWith({
      email: 'dupont.gerard@test.com',
      role: 'ADV',
    });

    await validCreationDriver.thenAccountIsCreatedWith({
      email: 'dupont.gerard@test.com',
      role: 'ADV',
    });
    await validCreationDriver.thenAccountHasAValidUUID();
  });

  test('création refusée si email manquant', async () => {
    missingEmailDriver = new MissingEmailRejectedE2eDriver();

    await missingEmailDriver.givenSystemIsOperational();
    missingEmailDriver.givenImAuthenticatedAsDSI();

    await missingEmailDriver.whenICreateAccountWithoutEmail();

    await missingEmailDriver.thenAccountIsNotCreated();
    missingEmailDriver.thenImInformedOfError('EMAIL_MISSING');
  });

  test('création refusée si rôle manquant', async () => {
    missingRoleDriver = new MissingRoleRejectedE2eDriver();

    await missingRoleDriver.givenSystemIsOperational();
    missingRoleDriver.givenImAuthenticatedAsDSI();

    await missingRoleDriver.whenICreateAccountWithoutRole();

    await missingRoleDriver.thenAccountIsNotCreated();
    missingRoleDriver.thenImInformedOfError('ROLE_MISSING');
  });

  test('stockage du mot de passe temporaire avec un hash', async () => {
    passwordHashedDriver = new PasswordHashedE2eDriver();

    await passwordHashedDriver.givenSystemIsOperational();
    passwordHashedDriver.givenImAuthenticatedAsDSI();

    await passwordHashedDriver.whenICreateAccountWith({
      email: 'dupont.gerard@test.com',
      role: 'ADV',
    });

    await passwordHashedDriver.thenAccountIsCreated();
    await passwordHashedDriver.thenPasswordIsStoredHashed();
  });

  test("mot de passe temporaire envoyé sur l'email", async () => {
    passwordSentByEmailDriver = new PasswordSentByEmailE2eDriver();

    await passwordSentByEmailDriver.givenSystemIsOperational();
    passwordSentByEmailDriver.givenImAuthenticatedAsDSI();

    await passwordSentByEmailDriver.whenICreateAccountWith({
      email: 'dupont.gerard@test.com',
      role: 'ADV',
    });

    await passwordSentByEmailDriver.thenAnEmailIsSentTo(
      'dupont.gerard@test.com',
    );
    await passwordSentByEmailDriver.thenEmailContainsPasswordInPlainText();
  });

  test('erreur lors de la sauvegarde', async () => {
    saveErrorDriver = new SaveErrorE2eDriver();

    await saveErrorDriver.givenSystemIsOperational();
    saveErrorDriver.givenImAuthenticatedAsDSI();
    await saveErrorDriver.givenDatabaseIsDown();

    await saveErrorDriver.whenICreateAccountWithValidData();

    saveErrorDriver.thenAccountIsNotCreated();
    saveErrorDriver.thenImInformedOfError('SAVE_ERROR');
  });
});
