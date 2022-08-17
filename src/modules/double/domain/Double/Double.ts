import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Bet, BetStatus } from '../Bet/Bet';
import { Round } from '../Round/Round';

interface User {
  name: string;
}

interface Limit {
  lose?: number;
  win?: number;
}

interface BetIn {
  start: string;
  end: string;
}

interface UpdateStatusDTO {
  id: string;
  status: BetStatus;
}

interface DoubleProps {
  rounds: Round[];
  bets: Bet[];
  user: User;
  bet_in?: BetIn;
  limit?: Limit;
  isMartinGale: boolean;
  betsDuringMartinGale: number;
  martinGales: number;
}

interface CreateDoubleDTO {
  user: User;
  bet_in?: BetIn;
  limit?: Limit;
}

export class Double extends Entity<DoubleProps> {
  get bets() {
    return this.props.bets;
  }

  get rounds() {
    return this.props.rounds;
  }

  get isMartinGale() {
    return this.props.isMartinGale;
  }

  get martinGales() {
    return this.props.martinGales;
  }

  set martinGales(value: number) {
    this.props.martinGales = value;
  }

  get betsDuringMartinGale() {
    return this.props.betsDuringMartinGale;
  }

  set betsDuringMartinGale(value: number) {
    this.props.betsDuringMartinGale = value;
  }

  set isMartinGale(value: boolean) {
    this.props.isMartinGale = value;
  }

  private constructor(props: DoubleProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  static save({ id, ...props }: DoubleProps & { id: string }) {
    return new Double(props, new UniqueIdentifier(id));
  }

  static create({ user }: CreateDoubleDTO) {
    return new Double({ user, rounds: [], bets: [], isMartinGale: false, betsDuringMartinGale: 0, martinGales: 0 });
  }

  addRound(round: Round) {
    this.props.rounds.push(round);
    console.log('Rodadas', JSON.stringify(this.rounds, null, 4));
    console.log('Apostas', JSON.stringify(this.bets, null, 4));
    console.log('Martingales', JSON.stringify(this.martinGales, null, 4));
  }

  addBet(bet: Bet) {
    if (this.isMartinGale) {
      this.betsDuringMartinGale += 1;
    }

    this.props.bets.push(bet);
  }

  isEndGame() {
    if (this.martinGales === 2) {
      return true;
    }

    if (this.props?.bet_in?.start && this.props?.bet_in?.end) {
      const [hour, minutes] = this.props.bet_in.end.split(':');

      const now = new Date();
      if (now.getHours() >= Number(hour) && now.getMinutes() >= Number(minutes)) {
        return true;
      }
    }

    if (this.checkLimit('lose', this.props?.limit?.lose) || this.checkLimit('win', this.props?.limit?.win)) {
      return true;
    }

    return false;
  }

  updateBetStatus({ id, status }: UpdateStatusDTO) {
    const betIndex = this.props.bets.findIndex(bet => bet.id.getValue() === id);

    this.bets[betIndex].props.status = status;
  }

  private checkLimit(status: string, limit: number) {
    const bets = this.bets.filter(bet => bet.status === status);
    let amount: number = 0;

    bets.forEach(bet => (amount += bet.quantity));

    if (amount >= limit) {
      return true;
    }

    return false;
  }

  get last_round() {
    return this.rounds[this.rounds.length - 1];
  }

  get last_bet() {
    return this.bets[this.bets.length - 1];
  }

  resetDouble(reason: string) {
    this.props.rounds = [] as Round[];
    this.props.bets = [] as Bet[];
    this.props.isMartinGale = false;
    this.props.betsDuringMartinGale = 0;
    console.log(`Double foi resetado - ${reason}`);
    console.log('Rodadas', JSON.stringify(this.rounds, null, 4));
    console.log('Apostas', JSON.stringify(this.bets, null, 4));
    console.log('Martingales', JSON.stringify(this.martinGales, null, 4));
  }
}
