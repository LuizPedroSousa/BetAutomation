import { BaseException } from '@shared/domain/BaseException';

export class CantBetInThisRoundException extends Error implements BaseException {
  constructor(reason?: string) {
    super(`Não foi possivel apostar nessa rodada: ${reason}`);
    this.name = 'CantBetInThisRoundException';
  }
}
