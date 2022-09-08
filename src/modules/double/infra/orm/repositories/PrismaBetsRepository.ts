import { client } from '@infra/orm/prisma';
import { Bet } from '@modules/double/domain/Bet/Bet';
import { BetMapper } from '@modules/double/mappers/BetMapper';
import { BetsRepository } from '@modules/double/repositories/BetsRepository';
import { injectable } from 'tsyringe';

@injectable()
export class PrismaBetsRepository implements BetsRepository {
  async add(data: Bet): Promise<Bet> {
    const betPersistence = BetMapper.toPersistence(data);
    const createdBet = await client.bet.create({
      data: {
        ...betPersistence,
        round: {
          connect: {
            id: betPersistence.round.id,
          },
        },
        color: {
          create: {
            ...betPersistence.color,
          },
        },
      },
      include: {
        color: true,
        round: true,
      },
    });

    return BetMapper.toDomain(createdBet);
  }

  public async updateById(data: Bet): Promise<Bet> {
    const betPersistence = BetMapper.toPersistence(data);
    const updatedBet = await client.bet.update({
      where: { id: data.id.getValue() },
      data: betPersistence,
      include: {
        color: true,
        round: true,
      },
    });

    return BetMapper.toDomain(updatedBet);
  }
  public async findById(id: string): Promise<Bet> {
    const betPersistence = await client.bet.findUnique({
      where: {
        id,
      },
      include: {
        color: true,
        round: true,
      },
    });

    return BetMapper.toDomain(betPersistence);
  }
}
