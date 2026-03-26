import { CommandResult } from '@src/shared/result/commandResult';

export enum EmailValidationError {
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
}

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(readonly value: string) {}

  static from(value: string): Email {
    return new Email(value);
  }

  static create(value: string): CommandResult<EmailValidationError> {
    if (!Email.EMAIL_REGEX.test(value)) {
      return CommandResult.failure(EmailValidationError.INVALID_EMAIL_FORMAT);
    }
    return CommandResult.success(new Email(value));
  }
}
