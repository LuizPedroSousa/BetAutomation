import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GoToDoubleUseCase implements UseCase<void, void> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute() {
    await this.headlessProvider.click({
      target: 'body > header > div.had-container > nav > div > ul > li.double > a > span',
      timeout: 2000,
    });
  }
}
