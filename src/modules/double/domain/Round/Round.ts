import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';
import { Color, CreateColorDTO } from '../Color/Color';
import { InvalidColorException } from '../Color/exceptions/InvalidColorException';
import { InvalidRoundException } from './exceptions/InvalidRoundException';

interface RoundProps {
  color: Color;
  seed: string;
}

interface CreateRoundDTO {
  color: CreateColorDTO;
  seed: string;
  rounds: Round[];
}

interface ValidateRoundDTO {
  rounds: Round[];
  color: CreateColorDTO;
}

export class Round extends Entity<RoundProps> {
  get color() {
    return this.props.color;
  }

  get seed() {
    return this.props.seed;
  }

  private constructor(props: RoundProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  static save({ id, ...props }: RoundProps & { id: string }) {
    return new Round(props, new UniqueIdentifier(id));
  }

  static create({ seed, color, rounds }: CreateRoundDTO): Either<InvalidRoundException | InvalidColorException, Round> {
    if (
      !Round.isValid({
        rounds,
        color,
      })
    ) {
      return left(new InvalidRoundException('quebra de cores'));
    }

    const colorOrError = Color.create(color);

    if (colorOrError.isLeft()) {
      return left(colorOrError.value);
    }

    return right(
      new Round({
        color: colorOrError.value,
        seed,
      }),
    );
  }

  static isValid({ rounds, color }: ValidateRoundDTO) {
    let result = true;

    if (rounds.length > 0) {
      for (let round of rounds) {
        if (round.color.name !== color.name) {
          result = false;
          break;
        }
      }
    }

    return result;
  }
}
