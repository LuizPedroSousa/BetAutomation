import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { left, right } from '@shared/either';
import { inject, injectable } from 'tsyringe';
import { InvalidRoundException } from '../domain/Round/exceptions/InvalidRoundException';
import { Round } from '../domain/Round/Round';

import { GetSmashRoundDTO } from './dtos/Smash/GetSmashRoundDTO';
import { GetSmashRoundResponse } from './responses/Smash/GetSmashRoundResponse';

@injectable()
export class GetRoundUseCase implements UseCase<GetSmashRoundDTO, GetSmashRoundResponse> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute({ older_round_id }: GetSmashRoundDTO): GetSmashRoundResponse {
    let currentRoundId = await this.headlessProvider.getText({
      target: 'div.info-bg div.seamless-title span:nth-of-type(2)',
      is_iframe: true,
      max_selector_timeout: 40000,
      timeout: 2000,
    });

    if (!Number(currentRoundId) || (older_round_id && currentRoundId === older_round_id)) {
      return left(new InvalidRoundException());
    }

    return right(currentRoundId);
  }
}
