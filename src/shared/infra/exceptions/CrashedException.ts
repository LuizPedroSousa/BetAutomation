import { BaseException } from '@shared/domain/BaseException';

export class CrashedException extends Error implements BaseException {
  constructor(reason: string) {
    super(`Falha interna, ${reason}`);

    this.name = 'CrashedException';
  }
}
