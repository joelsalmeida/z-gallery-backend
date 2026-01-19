function loadEnv() {
  const env = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_EXPIRATION_IN: process.env.JWT_ACCESS_EXPIRATION_IN,
    JWT_REFRESH_EXPIRATION_IN: process.env.JWT_REFRESH_EXPIRATION_IN,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
  };

  for (const [key, value] of Object.entries(env)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return env as Record<keyof typeof env, string>;
}

export interface AppConfig {
  jwt: {
    secret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  database: {
    url: string;
  };
  port: number;
}

export const appConfig = (): AppConfig => {
  const env = loadEnv();

  return {
    jwt: {
      secret: env.JWT_SECRET,
      accessExpiration: env.JWT_ACCESS_EXPIRATION_IN,
      refreshExpiration: env.JWT_REFRESH_EXPIRATION_IN,
    },
    database: {
      url: env.DATABASE_URL,
    },
    port: parseInt(env.PORT, 10),
  };
};
