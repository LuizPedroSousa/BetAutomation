import { BaseException } from '@shared/domain/BaseException';

export class MissingParamsException extends Error implements BaseException {
  constructor(fields: string[]) {
    super(`Parametros inválidos: ${fields.join(', ')}`);

    this.name = 'MissingParamsException';
  }
}
