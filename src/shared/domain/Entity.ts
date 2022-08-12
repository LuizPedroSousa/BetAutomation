import { UniqueIdentifier } from './UniqueIdentifier';
import { isValueObject, ValueObject } from './ValueObject';

const isEntity = (other: any): other is Entity<any> => {
  return other instanceof Entity;
};

export abstract class Entity<T> {
  constructor(readonly props: T | (T & ValueObject<any>), readonly id?: UniqueIdentifier) {
    this.id = id || new UniqueIdentifier();
    this.props = props;
  }

  public equals(other: Entity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    if (!isEntity(other)) {
      return false;
    }

    return this.id.equals(other.id);
  }

  public toJSON(): T {
    const formattedProps = this.props as any;

    Object.keys(formattedProps).forEach(key => {
      if (isValueObject(formattedProps?.[key]) || isEntity(formattedProps?.[key])) {
        formattedProps[key] = formattedProps[key].toJSON();
      }
    });

    return {
      id: this.id.getValue(),
      ...formattedProps,
    };
  }
}
