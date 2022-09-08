import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';
import { Color } from '../Color/Color';
import { Round } from '../Round/Round';
import { CantBetInThisRoundException } from './exceptions/CantBetInThisRoundException';

export type BetStatus = 'pending' | 'lose' | 'win';

interface BetProps {
  color: Color;
  round: Round;
  status: BetStatus;
  amount: number;
}

interface CreateBetDTO {
  amount: number;
  blacks: Round[];
  reds: Round[];
  bets: Bet[];
  current_round: Round;
}

interface BetInColorsDTO {
  amount: number;
  bets: Bet[];
}

export class Bet extends Entity<BetProps> {
  get status() {
    return this.props.status;
  }

  get amount() {
    return this.props.amount;
  }

  get color() {
    return this.props.color;
  }

  private constructor(props: BetProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  static save({ id, ...props }: BetProps & { id: string }) {
    return new Bet(props, new UniqueIdentifier(id));
  }

  static create({ amount, current_round, bets, blacks, reds }: CreateBetDTO): Either<CantBetInThisRoundException, Bet> {
    if (!Bet.isValid(blacks, reds)) {
      return left(new CantBetInThisRoundException('Padrão inválido'));
    }

    const colorOrError = Color.create({
      name: Bet.isBlack(blacks) ? 'red' : 'black',
    });

    if (colorOrError.isLeft()) {
      return left(colorOrError.value);
    }

    return right(
      new Bet({
        color: colorOrError.value,
        round: current_round,
        status: 'pending',
        amount: Bet.betAmount({ bets, amount }),
      }),
    );
  }

  static betAmount({ bets, amount }: BetInColorsDTO): number {
    let betAmount = amount;

    for (const bet of bets) {
      betAmount += bet.amount;
    }

    return betAmount;
  }

  static isValid(blacks: Round[], reds: Round[]): boolean {
    if (Bet.isBlack(blacks) || Bet.isRed(reds)) {
      return true;
    }

    return false;
  }

  static isBlack(blacks: Round[]): boolean {
    if (blacks.length === 3) {
      return true;
    }
    return false;
  }

  static isRed(reds: Round[]): boolean {
    if (reds.length === 3) {
      return true;
    }
    return false;
  }
}
