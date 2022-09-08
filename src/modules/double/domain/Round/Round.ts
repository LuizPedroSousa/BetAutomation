import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';
import { InvalidRoundException } from './exceptions/InvalidRoundException';

export type Color = 'red' | 'black' | 'white';

interface RoundProps {
  color: Color;
  number: number;
}

interface CreateRoundDTO {
  id: string;
  color: string;
  number: number;
  rounds: Round[];
}

interface ValidateRoundDTO {
  rounds: Round[];
  color: string;
}

export class Round extends Entity<RoundProps> {
  get color() {
    return this.props.color;
  }

  private constructor(props: RoundProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  static save({ id, ...props }: RoundProps & { id: string }) {
    return new Round(props, new UniqueIdentifier(id));
  }

  static create({ id, color, rounds, number }: CreateRoundDTO): Either<InvalidRoundException, Round> {
    if (
      !Round.isValid({
        rounds,
        color,
      })
    ) {
      return left(new InvalidRoundException('quebra de cores'));
    }

    return right(
      new Round(
        {
          color: color as Color,
          number,
        },
        new UniqueIdentifier(id),
      ),
    );
  }

  static isValid({ rounds, color }: ValidateRoundDTO) {
    let result = true;

    if (rounds.length > 0) {
      for (let round of rounds) {
        if (round.color !== color) {
          result = false;
          break;
        }
      }
    }

    return result;
  }
}
