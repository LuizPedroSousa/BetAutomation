import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { UseCase } from '@shared/domain/UseCase';
import { left, right } from '@shared/either';
import { inject, injectable } from 'tsyringe';
import { Bet } from '../domain/Bet/Bet';
import { BetsRepository } from '../repositories/BetsRepository';
import { BetSmashRoundDTO } from './dtos/Smash/BetSmashRoundDTO';
import { BetSmashRoundResponse } from './responses/Smash/BetSmashRoundResponse';

interface BetColorDTO {
  name: string;
  amount: number;
}

@injectable()
export class BetSmashRoundUseCase implements UseCase<BetSmashRoundDTO, BetSmashRoundResponse> {
  constructor(
    @inject('HeadlessProvider')
    private headlessProvider: HeadlessProvider,
  ) {}

  async execute({ amount, double }: BetSmashRoundDTO): BetSmashRoundResponse {
    const blacks = double.rounds.filter(round => round.color.name === 'black');
    const reds = double.rounds.filter(round => round.color.name === 'red');

    const betOrError = Bet.create({
      bets: double.bets,
      blacks,
      reds,
      amount,
      current_round: double.last_round,
    });

    if (betOrError.isLeft()) {
      return left(betOrError.value);
    }

    const bet = betOrError.value;

    await this.betRound({
      amount: bet.amount,
      name: bet.color.name,
    });

    return right(bet);
  }

  private async betRound({ amount, name }: BetColorDTO) {
    await this.headlessProvider.fillInput({
      target: 'form.bet-control input.el-input__inner[placeholder="Quantia"]',
      is_iframe: true,
      text: String(amount),
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
