import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { left, right } from '@shared/either';
import { inject, injectable } from 'tsyringe';
import { Round } from '../domain/Round/Round';
import { CreateSmashRoundDTO } from './dtos/Smash/CreateSmashRoundDTO';
import { CreateSmashRoundResponse } from './responses/Smash/CreateSmashRoundResponse';

@injectable()
export class CreateSmashRoundUseCase implements UseCase<CreateSmashRoundDTO, CreateSmashRoundResponse> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute({ round_id, rounds }: CreateSmashRoundDTO): CreateSmashRoundResponse {
    const colorNumber = await this.headlessProvider.getText({
      target: 'div.info-bg div.seamless-title div span.number',
      is_iframe: true,
      max_selector_timeout: 40000,
      timeout: 2000,
    });

    const colorClass = await this.headlessProvider.getAttribute({
      target: 'div.info-bg div.seamless-title > div',
      max_selector_timeout: 40000,
      attribute_name: 'class',
      is_iframe: true,
    });

    const [_, color] = colorClass.split(' ');

    const roundOrError = Round.create({ id: round_id, color, number: Number(colorNumber), rounds });

    if (roundOrError.isLeft()) {
      return left(roundOrError.value);
    }

    return right(roundOrError.value);
  }
}
