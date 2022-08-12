import { AuthenticateSmashUserUseCase } from '@modules/users/useCases/AuthenticateSmashUserUseCase';
import { AuthenticateSmashUserDTO } from '@modules/users/useCases/dtos/Smash/AuthenticateSmashUserDTO';
import { BaseJob } from '@shared/domain/BaseJob';
import { UseCase } from '@shared/domain/UseCase';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthenticateSmashUserJob extends BaseJob {
  constructor(
    @inject(AuthenticateSmashUserUseCase)
    private authenticateSmashUserUseCase: UseCase<AuthenticateSmashUserDTO, void>,
  ) {
    super();
  }

  protected async handle(): Promise<void> {
    const { body } = this.req;

    await this.authenticateSmashUserUseCase.execute(body);
  }
}
