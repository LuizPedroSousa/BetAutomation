import { Mapper } from '@shared/domain/Mapper';
import { Bet } from '../domain/Bet/Bet';
import { Bet as BetPersistence, Round as RoundPersistence, Color as ColorPersistence } from '@prisma/client';
import { RoundMapper } from './RoundMapper';
import { Round } from '../domain/Round/Round';
import { ColorMapper } from './ColorMapper';

export class BetMapper implements Mapper<Bet, BetPersistence> {
  static toDomain(data: BetPersistence & { color: ColorPersistence; round: RoundPersistence }): Bet {
    return Bet.save({
      id: data.id,
      color: ColorMapper.toDomain(data.color),
      round: RoundMapper.toDomain({ ...data.round, color: data.color }),
      status: data.status as any,
      amount: data.amount,
    });
  }

  static toPersistence(data: Bet): any {
    return {
      id: data.id.getValue(),
      color: ColorMapper.toPersistence(data.color),
      status: data.status,
      amount: data.amount,
      round: RoundMapper.toPersistence(data.props.round),
    };
  }
}
