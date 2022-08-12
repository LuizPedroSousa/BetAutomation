import { InvalidRoundException } from '@modules/double/domain/Round/exceptions/InvalidRoundException';
import { Either } from '@shared/either';

export type GetSmashRoundResponse = Promise<Either<InvalidRoundException, string>>;
