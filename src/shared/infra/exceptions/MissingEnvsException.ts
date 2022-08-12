import { BaseException } from '@shared/domain/BaseException';

export class MissingEnvsException extends Error implements BaseException {
  constructor(fields: string[]) {
    super(`Credenciais inválidas: ${fields.join(', ')}`);

    this.name = 'MissingEnvsException';
  }
}
