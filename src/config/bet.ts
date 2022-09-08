import { MissingEnvsException } from '@shared/infra/exceptions/MissingEnvsException';

interface Limit {
  lose?: number;
  win?: number;
}

interface BetIn {
  start: string;
  end: string;
}

interface Double {
  amount: number;
  limit?: Limit;
  bet_in?: BetIn;
}

interface BetConfig {
  double: Double;
}

export const betConfig = () => {
  const credentials: BetConfig = {
    double: {
      amount: Number(process.env.DOUBLE_BET_AMOUNT),
      limit: {
        lose: Number(process.env.DOUBLE_BET_STOP_LOSE),
        win: Number(process.env.DOUBLE_BET_STOP_WIN),
      },
      bet_in: {
        start: process.env.DOUBLE_BET_START_IN,
        end: process.env.DOUBLE_BET_END_IN,
      },
    },
  };

  if (!credentials.double?.amount) {
    throw new MissingEnvsException(['amount obrigatório']);
  }

  return credentials;
};
