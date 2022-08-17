import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';
import { Round } from '../Round/Round';
import { CantBetInThisRoundException } from './exceptions/CantBetInThisRoundException';

export type Color = 'red' | 'black' | 'white';

export type BetStatus = 'pending' | 'lose' | 'win';

export interface BetColor {
  color: Color;
  quantity: number;
}

interface BetQuantity {
  red: number;
  black: number;
  white: number;
}

interface BetProps {
  colors: BetColor[];
  round: Round;
  status: BetStatus;
  quantity: number;
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

  get quantity() {
    return this.props.quantity;
  }

  get colors() {
    return this.props.colors;
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

    const { betQuantity, betInColors } = Bet.betInColors({ blacks, bets, quantity });

    return right(
      new Bet({
        colors: betInColors,
        round: current_round,
        status: 'pending',
        quantity: betQuantity,
      }),
    );
  }

  static betInColors({ blacks, bets, quantity }: BetInColorsDTO): { betQuantity: number; betInColors: BetColor[] } {
    const betAmount = quantity;

    const colors = bets.map(bet => bet.colors).flatMap(color => color);

    for (const color of colors) {
      betAmount[color.color] += color.quantity;
    }

    const betInColor = Bet.isBlack(blacks) ? 'red' : 'black';

    const whiteBet = betAmount.white + betAmount[betInColor];

    return {
      betInColors: [
        {
          color: betInColor,
          quantity: betAmount[betInColor],
        },
        {
          color: 'white',
          quantity: whiteBet % 14 === 0 ? whiteBet / 14 : whiteBet,
        },
      ],
      betQuantity: betAmount.white + (whiteBet % 14 === 0 ? whiteBet / 14 : whiteBet),
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
