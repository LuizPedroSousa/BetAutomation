import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { inject, injectable } from 'tsyringe';
import { UpdateBetStatusDTO } from './dtos/Smash/UpdateBetStatusDTO';
import { UpdateBetStatusResponse } from './responses/Smash/UpdateBetStatusResponse';

@injectable()
export class UpdateBetStatusUseCase implements UseCase<UpdateBetStatusDTO, UpdateBetStatusResponse> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute({ bet }: UpdateBetStatusDTO): UpdateBetStatusResponse {
    const colorClass = await this.headlessProvider.getAttribute({
      target: 'div.info-bg div.seamless-title > div',
      max_selector_timeout: 40000,
      attribute_name: 'class',
      is_iframe: true,
    });

    const [_, color] = colorClass.split(' ');

    if (bet.color.name !== color) {
      return 'lose';
    }

    return 'win';
  }
}
