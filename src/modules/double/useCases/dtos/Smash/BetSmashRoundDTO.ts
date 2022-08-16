import { Double } from '@modules/double/domain/Double/Double';

interface Quantity {
  red: number;
  black: number;
  white: number;
}

export interface BetSmashRoundDTO {
  quantity: Quantity;
  double: Double;
}
