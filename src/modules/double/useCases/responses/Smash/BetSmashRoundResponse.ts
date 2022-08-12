import { Bet } from '@modules/double/domain/Bet/Bet';
import { CantBetInThisRoundException } from '@modules/double/domain/Bet/exceptions/CantBetInThisRoundException';
import { Either } from '@shared/either';

export type BetSmashRoundResponse = Promise<Either<CantBetInThisRoundException, Bet>>;
