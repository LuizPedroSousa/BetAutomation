import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { left, right } from '@shared/either';
import { inject, injectable } from 'tsyringe';
import { Bet, BetColor } from '../domain/Bet/Bet';
import { BetSmashRoundDTO } from './dtos/Smash/BetSmashRoundDTO';
import { BetSmashRoundResponse } from './responses/Smash/BetSmashRoundResponse';

@injectable()
export class BetSmashRoundUseCase implements UseCase<BetSmashRoundDTO, BetSmashRoundResponse> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute({ quantity, double }: BetSmashRoundDTO): BetSmashRoundResponse {
    const blacks = double.rounds.filter(round => round.color === 'black');
    const reds = double.rounds.filter(round => round.color === 'red');

    const betOrError = Bet.create({
      bets: double.bets,
      blacks,
      reds,
      quantity,
      current_round: double.last_round,
    });

    if (betOrError.isLeft()) {
      return left(betOrError.value);
    }

    await this.betRound(betOrError.value.color);

    return right(betOrError.value);
  }

  private async betRound({ quantity, name }: BetColor) {
    await this.headlessProvider.fillInput({
      target: 'form.bet-control input.el-input__inner[placeholder="Quantia"]',
      is_iframe: true,
      text: String(quantity),
      max_selector_timeout: 2000,
    });

    await this.headlessProvider.click({
      target: `div.game-controls div.select > div.${name}[role="button"]`,
      is_iframe: true,
      text: {
        value: name === 'white' ? 'x14' : 'x2',
        element: 'div',
      },
    });

    await this.headlessProvider.click({
      target: 'div.game-controls div.place-bet button[type="button"]',
      is_iframe: true,
      max_selector_timeout: 2000,
    });
  }
}
