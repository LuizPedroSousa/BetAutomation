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

interface BetProps {
  colors: BetColor[];
  round: Round;
  status: BetStatus;
  quantity: number;
}

interface CreateBetDTO {
  quantity: number;
  blacks: Round[];
  reds: Round[];
  bets: Bet[];
  current_round: Round;
}

interface BetInColorsDTO {
  quantity: number;
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
    let betAmount: number = quantity;
    let betInWhite: number = 0;

    const colors = bets.map(bet => bet.colors).flatMap(color => color);

    for (const color of colors) {
      if (color.color !== 'white') {
        betAmount += color.quantity;
      } else {
        betInWhite += color.quantity;
      }
    }

    return {
      betInColors: [
        {
          color: Bet.isBlack(blacks) ? 'red' : 'black',
          quantity: betAmount,
        },
        {
          color: 'white',
          quantity: betInWhite + betAmount / 14,
        },
      ],
      betQuantity: betAmount + (betInWhite + betAmount / 14),
    };
  }

  static isValid(blacks: Round[], reds: Round[]): boolean {
    if (Bet.isBlack(blacks) || Bet.isRed(reds)) {
      return true;
    }

    return false;
  }

  static isBlack(blacks: Round[]): boolean {
    if (blacks.length === 4) {
      return true;
    }
    return false;
  }

  static isRed(reds: Round[]): boolean {
    if (reds.length === 4) {
      return true;
    }
    return false;
  }
}
