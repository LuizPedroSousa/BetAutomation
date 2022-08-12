import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
  [key: string]: any;
}

export const isValueObject = (other: any): other is ValueObject<any> => {
  return other instanceof ValueObject;
};

export abstract class ValueObject<T extends ValueObjectProps> {
  constructor(readonly props: T) {
    this.props = Object.freeze(props);
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other.props === undefined) {
      return false;
    }

    return shallowEqual(this.props, other.props);
  }

  public toJSON(): T {
    const propsKeys = Object.keys(this.props);

    if (propsKeys.length === 1 && propsKeys[0] === 'value') {
      return this.props.value;
    }

    return this.props;
  }
}
