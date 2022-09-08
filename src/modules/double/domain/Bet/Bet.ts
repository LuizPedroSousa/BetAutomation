import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';
import { Round } from '../Round/Round';
import { CantBetInThisRoundException } from './exceptions/CantBetInThisRoundException';

export type Color = 'red' | 'black' | 'white';

export type BetStatus = 'pending' | 'lose' | 'win';

export interface BetColor {
  name: Color;
  quantity: number;
}

interface BetQuantity {
  red: number;
  black: number;
  white: number;
}

interface BetProps {
  color: BetColor;
  round: Round;
  status: BetStatus;
  total: number;
}

interface CreateBetDTO {
  quantity: BetQuantity;
  blacks: Round[];
  reds: Round[];
  bets: Bet[];
  current_round: Round;
}

interface BetInColorsDTO {
  quantity: BetQuantity;
  blacks: Round[];
  bets: Bet[];
}

export class Bet extends Entity<BetProps> {
  get status() {
    return this.props.status;
  }

  get total() {
    return this.props.total;
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

  static create({
    quantity,
    current_round,
    bets,
    blacks,
    reds,
  }: CreateBetDTO): Either<CantBetInThisRoundException, Bet> {
    if (!Bet.isValid(blacks, reds)) {
      return left(new CantBetInThisRoundException('Padrão inválido'));
    }

    const { betTotal, betInColor } = Bet.betInColor({ blacks, bets, quantity });

    return right(
      new Bet({
        color: betInColor,
        round: current_round,
        status: 'pending',
        total: betTotal,
      }),
    );
  }

  static betInColor({ blacks, bets, quantity }: BetInColorsDTO): { betTotal: number; betInColor: BetColor } {
    const betAmount = quantity;

    const colors = bets.map(bet => bet.color).flatMap(color => color);

    for (const color of colors) {
      betAmount[color.name] += color.quantity;
    }

    const betInColor = Bet.isBlack(blacks) ? 'red' : 'black';

    const whiteBet = betAmount.white + betAmount[betInColor];

    return {
      betInColor: {
        name: betInColor,
        quantity: betAmount[betInColor],
      },
      betTotal: betAmount.white + (whiteBet % 14 === 0 ? whiteBet / 14 : whiteBet),
    };
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
