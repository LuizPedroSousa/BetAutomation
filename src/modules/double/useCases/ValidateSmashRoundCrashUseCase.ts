import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ValidateSmashRoundUseCase implements UseCase<void, boolean> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute(): Promise<boolean> {
    const error = await this.headlessProvider.getText({
      target: '#app > div.error-section > span',
      is_iframe: true,
      max_selector_timeout: 2000,
    });

    if (error) {
      return false;
    }

    return true;
  }
}
