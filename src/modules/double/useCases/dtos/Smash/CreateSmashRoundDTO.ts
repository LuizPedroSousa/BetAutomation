import { Round } from '@modules/double/domain/Round/Round';

export interface CreateSmashRoundDTO {
  round_id: string;
  rounds: Round[];
}
