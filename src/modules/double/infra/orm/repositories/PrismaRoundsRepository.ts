import { client } from '@infra/orm/prisma';
import { Round } from '@modules/double/domain/Round/Round';
import { RoundMapper } from '@modules/double/mappers/RoundMapper';
import { RoundsRepository } from '@modules/double/repositories/RoundsRepository';
import { Console } from 'console';
import { injectable } from 'tsyringe';

@injectable()
export class PrismaRoundsRepository implements RoundsRepository {
  async add(data: Round): Promise<Round> {
    const roundPersistence = RoundMapper.toPersistence(data);
    console.log(JSON.stringify(roundPersistence));

    const createdRound = await client.round.create({
      data: {
        ...roundPersistence,
        color: {
          create: {
            ...roundPersistence.color,
          },
        },
      },
      include: {
        color: true,
      },
    });

    return RoundMapper.toDomain(createdRound);
  }

  public async updateById(data: Round): Promise<Round> {
    const roundPersistence = RoundMapper.toPersistence(data);
    const updatedRound = await client.round.update({
      where: { id: data.id.getValue() },
      data: roundPersistence,
      include: {
        color: true,
      },
    });

    return RoundMapper.toDomain(updatedRound);
  }
  public async findById(id: string): Promise<Round> {
    const betPersistence = await client.round.findUnique({
      where: {
        id,
      },
      include: {
        color: true,
      },
    });

    return RoundMapper.toDomain(betPersistence);
  }
}
