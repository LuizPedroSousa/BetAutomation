import { Mapper } from '@shared/domain/Mapper';
import { Bet } from '../domain/Bet/Bet';
import { Round as RoundPersistence, Color as ColorPersistence } from '@prisma/client';
import { Round } from '../domain/Round/Round';
import { ColorMapper } from './ColorMapper';

export class RoundMapper implements Mapper<Bet, RoundPersistence> {
  static toDomain(data: RoundPersistence & { color: ColorPersistence }): Round {
    return Round.save({
      id: data.id,
      seed: data.seed,
      color: ColorMapper.toDomain(data.color),
    });
  }

  static toPersistence(data: Round): any {
    return {
      id: data.id.getValue(),
      color: ColorMapper.toPersistence(data.color),
      seed: data.seed,
    };
  }
}
