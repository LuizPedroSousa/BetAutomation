import { MissingEnvsException } from '@shared/infra/exceptions/MissingEnvsException';

interface Limit {
  lose?: number;
  win?: number;
}

interface BetIn {
  start: string;
  end: string;
}

interface AmountColors {
  red: number;
  black: number;
  white: number;
}

interface Double {
  amount: AmountColors;
  limit?: Limit;
  bet_in?: BetIn;
}

interface BetConfig {
  double: Double;
}

export const betConfig = () => {
  const credentials: BetConfig = {
    double: {
      amount: {
        red: Number(process.env.DOUBLE_BET_RED),
        black: Number(process.env.DOUBLE_BET_BLACK),
        white: Number(process.env.DOUBLE_BET_WHITE),
      },
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
