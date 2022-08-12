export class Identifier<T> {
  constructor(private value: T) {
    this.value = value;
  }

  public equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }

    return this.value === id.getValue();
  }

  public toString(): string {
    return String(this.value);
  }

  public getValue(): T {
    return this.value;
  }
}
