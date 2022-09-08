import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';
import { InvalidColorException } from './exceptions/InvalidColorException';

export type ColorName = 'red' | 'black' | 'white';

interface ColorProps {
  name: ColorName;
  number: number;
}

export interface CreateColorDTO {
  name: string;
  number?: number;
}

export class Color extends Entity<ColorProps> {
  get name() {
    return this.props.name;
  }

  get number() {
    return this.props.number;
  }

  private constructor(props: ColorProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  static save({ id, ...props }: ColorProps & { id: string }) {
    return new Color(props, new UniqueIdentifier(id));
  }

  static create(data: CreateColorDTO): Either<InvalidColorException, Color> {
    if (!Color.isValid(data)) {
      return left(new InvalidColorException());
    }

    return right(
      new Color({
        name: data.name as ColorName,
        number: data?.number,
      }),
    );
  }

  static isValid({ name }: CreateColorDTO) {
    const validColors = ['black', 'red', 'white'];

    if (!name || !validColors.includes(name)) {
      return false;
    }

    return true;
  }
}
