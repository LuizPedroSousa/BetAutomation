import { BaseException } from '@shared/domain/BaseException';

export class InvalidRoundException extends Error implements BaseException {
  constructor(reason?: string) {
    super(`Rodada inválida: ${reason}`);
    this.name = 'InvalidRoundException';
  }
}
