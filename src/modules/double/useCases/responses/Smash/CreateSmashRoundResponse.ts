import { InvalidRoundException } from '@modules/double/domain/Round/exceptions/InvalidRoundException';
import { Round } from '@modules/double/domain/Round/Round';
import { Either } from '@shared/either';

export type CreateSmashRoundResponse = Promise<Either<InvalidRoundException, Round>>;
