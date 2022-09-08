import { BaseException } from '@shared/domain/BaseException';

export class InvalidColorException extends Error implements BaseException {
  constructor() {
    super('🚨 Cor invalida');
    this.name = 'InvalidColorException';
  }
}
