import { Bet } from '@modules/double/domain/Bet/Bet';
import { Double } from '@modules/double/domain/Double/Double';
import { BetSmashRoundUseCase } from '@modules/double/useCases/BetSmashRoundUseCase';
import { CreateSmashRoundUseCase } from '@modules/double/useCases/CreateSmashRoundUseCase';
import { BetSmashRoundDTO } from '@modules/double/useCases/dtos/Smash/BetSmashRoundDTO';
import { CreateSmashRoundDTO } from '@modules/double/useCases/dtos/Smash/CreateSmashRoundDTO';
import { GetSmashRoundDTO } from '@modules/double/useCases/dtos/Smash/GetSmashRoundDTO';
import { GoToDoubleUseCase } from '@modules/double/useCases/dtos/Smash/GoToDoubleUseCase';
import { UpdateBetStatusDTO } from '@modules/double/useCases/dtos/Smash/UpdateBetStatusDTO';
import { GetRoundUseCase } from '@modules/double/useCases/GetRoundUseCase';
import { BetSmashRoundResponse } from '@modules/double/useCases/responses/Smash/BetSmashRoundResponse';
import { CreateSmashRoundResponse } from '@modules/double/useCases/responses/Smash/CreateSmashRoundResponse';
import { GetSmashRoundResponse } from '@modules/double/useCases/responses/Smash/GetSmashRoundResponse';
import { UpdateBetStatusResponse } from '@modules/double/useCases/responses/Smash/UpdateBetStatusResponse';
import { UpdateBetStatusUseCase } from '@modules/double/useCases/UpdateBetStatusUseCase';
import { ValidateSmashRoundUseCase } from '@modules/double/useCases/ValidateSmashRoundCrashUseCase';
import { BaseJob } from '@shared/domain/BaseJob';
import { UseCase } from '@shared/domain/UseCase';
import { delay, inject, injectable } from 'tsyringe';

@injectable()
export class DoubleSmashBetJob extends BaseJob {
  private double: Double;

  constructor(
    @inject(delay(() => CreateSmashRoundUseCase))
    private createRoundUseCase: UseCase<CreateSmashRoundDTO, CreateSmashRoundResponse>,

    @inject(GetRoundUseCase)
    private getRoundUseCase: UseCase<GetSmashRoundDTO, GetSmashRoundResponse>,
    @inject(delay(() => BetSmashRoundUseCase))
    private betRoundUseCase: UseCase<BetSmashRoundDTO, BetSmashRoundResponse>,

    @inject(UpdateBetStatusUseCase)
    private updateBetStatusUseCase: UseCase<UpdateBetStatusDTO, UpdateBetStatusResponse>,

    @inject(ValidateSmashRoundUseCase)
    private validateRoundUseCase: UseCase<void, boolean>,

    @inject(GoToDoubleUseCase)
    private goToDoubleUseCase: UseCase<void, void>,
  ) {
    super();
  }

  protected async handle(): Promise<void> {
    const {
      body: { bet_in, user },
    } = this.req;

    this.double = Double.create({
      user,
      bet_in,
    });

    if (bet_in?.start) {
      await this.waitForTime();
      await this.goToDoubleUseCase.execute();
      return this.loop();
    }

    await this.goToDoubleUseCase.execute();

    await this.loop();
  }

  private async waitForTime(): Promise<void> {
    const {
      body: { bet_in },
    } = this.req;

    const [hour, minutes] = bet_in.start.split(':');

    const sleep = () => new Promise<void>(resolve => setTimeout(resolve, 2000));

    await sleep();

    const now = new Date();

    if (now.getHours() >= Number(hour) && now.getMinutes() >= Number(minutes)) {
      return;
    }

    return this.waitForTime();
  }

  private async loop(): Promise<void> {
    const {
      body: { amount },
    } = this.req;

    if (this.double.isEndGame()) {
      console.log('JOGO ENCERRADO');
      this.double.resetDouble('o jogo foi encerrado.');
      return;
    }

    const isRoundValid = await this.validateRoundUseCase.execute();

    if (!isRoundValid) {
      this.double.resetDouble('Jogo crashou tentando novamente..');
      await this.goToDoubleUseCase.execute();
    }

    const roundIdOrError = await this.getRoundUseCase.execute({
      older_round_id: this.double.last_round?.seed,
    });

    if (roundIdOrError.isLeft()) {
      return this.loop();
    }

    const roundOrError = await this.createRoundUseCase.execute({
      round_id: roundIdOrError.value,
      rounds: this.double.rounds,
    });

    if (roundOrError.isLeft()) {
      this.double.resetDouble(roundOrError.value.message);
      return this.loop();
    }

    this.double.addRound(roundOrError.value);

    const betOrError = await this.betRoundUseCase.execute({
      amount,
      double: this.double,
    });

    if (betOrError.isRight()) {
      this.double.addBet(betOrError.value);
      console.log('Aposta foi feita', JSON.stringify(this.double.last_bet, null, 4));
      await this.updateBet(betOrError.value);
    }

    return this.loop();
  }

  private async updateBet(bet: Bet): Promise<void> {
    const roundIdOrError = await this.getRoundUseCase.execute({
      older_round_id: this.double.last_round?.seed,
    });

    if (roundIdOrError.isLeft()) {
      return this.updateBet(bet);
    }

    const status = await this.updateBetStatusUseCase.execute({
      bet,
    });

    this.double.updateBetStatus({
      status,
      id: bet.id.getValue(),
    });

    console.log(`Você ${status === 'win' ? 'ganhou' : 'perdeu'} a aposta!`, JSON.stringify(this.double.bets, null, 4));
  }
}
