import { MissingEnvsException } from '@shared/infra/exceptions/MissingEnvsException';

interface AuthCredentials {
  email: string;
  password: string;
}

interface Users {
  smash: AuthCredentials;
}

interface AuthConfig {
  users: Users;
}

export const authConfig = () => {
  const credentials: AuthConfig = {
    users: {
      smash: {
        email: process.env.SMASH_USER_NAME,
        password: process.env.SMASH_USER_PASSWORD,
      },
    },
  };

  if (!credentials?.users?.smash?.email || !credentials?.users?.smash?.password) {
    throw new MissingEnvsException(['smash_user_name', 'smash_user_password']);
  }

  return credentials;
};
