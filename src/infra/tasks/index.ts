import { authConfig } from '@config/auth';
import { HeadlessProvider } from '@infra/providers/HeadlessProvider/ports/HeadlessProvider';
import { AuthenticateSmashUserJob } from '@modules/users/infra/jobs/AuthenticateSmashUserJob';
import { container } from 'tsyringe';

import { DoubleSmashBetJob } from '@modules/double/infra/jobs/DoubleSmashBetJob';
import { betConfig } from '@config/bet';

const headlessProvider = container.resolve<HeadlessProvider>('HeadlessProvider');

const authenticateSmashUserJob = container.resolve(AuthenticateSmashUserJob);
const doubleSmashBetJob = container.resolve(DoubleSmashBetJob);

const tasks = async (): Promise<void> => {
  try {
    await headlessProvider.open({});

    const { users } = authConfig();

    const { double } = betConfig();

    await authenticateSmashUserJob.execute({
      body: users.smash,
    });

    await doubleSmashBetJob.execute({
      body: {
        ...double,
        user: {
          email: users.smash.email,
        },
      },
    });
  } catch (error: any) {
    console.log(getError(error));
    process.exit(0);
  }
};

const getError = (error: any): string | Error => {
  const errors = ['CrashedException', 'MissingParamsException'];

  if (errors.includes(error.name)) {
    return error.message;
  }

  return error;
};

export { tasks };
