import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  CreateUserAccountCommand,
  CreateUserAccountError,
  CreateUserAccountUseCase,
} from '@src/generic/identityAndAccessManagement/createUserAccount/createUserAccount.useCase';

@Controller('identity-and-access-management')
export class CreateUserAccountController {
  constructor(
    @Inject(CreateUserAccountUseCase)
    private readonly createUserAccountUseCase: CreateUserAccountUseCase,
  ) {}

  @Post('create-user-account')
  async createUserAccount(
    @Body() body: CreateUserAccountCommand,
    @Res() res: Response,
  ): Promise<void> {
    if (!body.email) {
      res.status(400).json({ error: 'EMAIL_MISSING' });
      return;
    }

    if (!body.role) {
      res.status(400).json({ error: 'ROLE_MISSING' });
      return;
    }

    const result = await this.createUserAccountUseCase.execute(body);

    if (result.isSuccess()) {
      res.status(201).send();
      return;
    }

    switch (result.getError()) {
      case CreateUserAccountError.EMAIL_ALREADY_USED:
        res.status(409).send();
        return;
      case CreateUserAccountError.SAVE_ERROR:
        res.status(500).json({ error: 'SAVE_ERROR' });
        return;
      default:
        res.status(400).send();
    }
  }
}
