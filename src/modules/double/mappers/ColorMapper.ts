import { Mapper } from '@shared/domain/Mapper';
import { Bet } from '../domain/Bet/Bet';
import { Round as RoundPersistence, Color as ColorPersistence } from '@prisma/client';
import { Color } from '../domain/Color/Color';

export class ColorMapper implements Mapper<Bet, RoundPersistence> {
  static toDomain(data: ColorPersistence): Color {
    return Color.save({
      id: data.id,
      name: data.name as any,
      number: data.number,
    });
  }

  static toPersistence(data: Color): Partial<ColorPersistence> {
    return {
      id: data.id.getValue(),
      name: data.name,
      number: data?.number,
    };
  }
}
