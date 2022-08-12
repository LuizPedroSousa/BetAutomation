import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { inject, injectable } from 'tsyringe';
import { AuthenticateSmashUserDTO } from './dtos/Smash/AuthenticateSmashUserDTO';

@injectable()
export class AuthenticateSmashUserUseCase implements UseCase<AuthenticateSmashUserDTO, void> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute({ email, password }: AuthenticateSmashUserDTO) {
    await this.headlessProvider.goTo({
      url: 'https://www.smashup.com/',
      navigation_timeout: 20000,
    });

    await this.headlessProvider.click({
      target: 'div',
      attributes: {
        id: '_player_login_area',
      },
      element: '> div.hidden-xs.is-desktop > a.login-tab',
      text: {
        value: 'Registre-se',
      },
      timeout: 2000,
    });

    await this.headlessProvider.fillInput({
      target: 'form',
      attributes: {
        id: '_og_id_1',
      },
      element: '> div:nth-child(2) > input',
      element_attributes: {
        name: 'login',
        placeholder: 'Nome de usuário',
      },
      timeout: 2000,
      text: email,
    });

    await this.headlessProvider.fillInput({
      target: 'form',
      attributes: {
        id: '_og_id_1',
      },
      element: '> div:nth-child(3) > input',
      element_attributes: {
        name: 'password',
        placeholder: 'Senha',
      },
      text: password,
    });

    await this.headlessProvider.click({
      target: 'form',
      attributes: {
        id: '_og_id_1',
      },
      element: '> input.loginBtn',
    });

    await this.headlessProvider.getElement({
      target: 'div.user__name',
      max_selector_timeout: 6000,
    });
  }
}
