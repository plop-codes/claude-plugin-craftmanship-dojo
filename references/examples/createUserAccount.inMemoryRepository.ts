import type { UserAccount } from '@src/generic/identityAndAccessManagement/shared/userAccount.entity';
import type { CreateUserAccountUserAccountRepository } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.userAccountRepository';

export class CreateUserAccountInMemoryUserAccountRepository
  implements CreateUserAccountUserAccountRepository
{
  userAccounts: UserAccount[] = [];
  private shouldFailOnSave = false;

  simulateDatabaseDown(): void {
    this.shouldFailOnSave = true;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userAccounts.some((account) => account.email.value === email);
  }

  async save(userAccount: UserAccount): Promise<void> {
    if (this.shouldFailOnSave) {
      throw new Error('Database is down');
    }
    this.userAccounts.push(userAccount);
  }
}
