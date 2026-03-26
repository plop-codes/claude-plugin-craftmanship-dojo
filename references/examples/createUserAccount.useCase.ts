import { Inject, Injectable } from '@nestjs/common';
import type { CreateUserAccountUserAccountRepository } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.userAccountRepository';
import { TypeOrmCreateUserAccountUserAccountRepository } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.typeOrmRepository';
import {
  UserAccount,
  UserAccountValidationError,
} from '@src/generic/identityAndAccessManagement/shared/userAccount.entity';
import type { CreateUserAccountPasswordHasher } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.passwordHasher';
import { CryptoCreateUserAccountPasswordHasher } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.cryptoPasswordHasher';
import type { CreateUserAccountEmailSender } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.emailSender';
import { SmtpCreateUserAccountEmailSender } from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.smtpEmailSender';
import { CommandResult } from '@src/shared/result/commandResult';

export type CreateUserAccountCommand = {
  email: string;
  role: string;
};

export enum CreateUserAccountError {
  EMAIL_ALREADY_USED = 'EMAIL_ALREADY_USED',
  SAVE_ERROR = 'SAVE_ERROR',
}

export type CreateUserAccountErrors =
  | UserAccountValidationError
  | CreateUserAccountError;

@Injectable()
export class CreateUserAccountUseCase {
  constructor(
    @Inject(TypeOrmCreateUserAccountUserAccountRepository)
    private userAccountRepository: CreateUserAccountUserAccountRepository,
    @Inject(CryptoCreateUserAccountPasswordHasher)
    private passwordHasher: CreateUserAccountPasswordHasher,
    @Inject(SmtpCreateUserAccountEmailSender)
    private emailSender: CreateUserAccountEmailSender,
  ) {}

  async execute(
    command: CreateUserAccountCommand,
  ): Promise<CommandResult<CreateUserAccountErrors>> {
    const plainPassword = UserAccount.generatePassword();
    const hashedPassword = this.passwordHasher.hash(plainPassword);

    const result = UserAccount.create(
      command.email,
      command.role,
      hashedPassword,
    );

    if (result.isFailure()) {
      return CommandResult.failure(result.getError());
    }

    try {
      const emailAlreadyUsed = await this.userAccountRepository.existsByEmail(
        command.email,
      );
      if (emailAlreadyUsed) {
        return CommandResult.failure(CreateUserAccountError.EMAIL_ALREADY_USED);
      }

      await this.userAccountRepository.save(result.getValue<UserAccount>());
    } catch {
      return CommandResult.failure(CreateUserAccountError.SAVE_ERROR);
    }

    await this.emailSender.sendPassword(command.email, plainPassword.value);

    return CommandResult.success();
  }
}
