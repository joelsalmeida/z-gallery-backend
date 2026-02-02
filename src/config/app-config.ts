function loadEnv() {
  const env = {
    PORT: process.env.PORT,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_EXPIRATION_IN: process.env.JWT_ACCESS_EXPIRATION_IN,
    JWT_REFRESH_EXPIRATION_IN: process.env.JWT_REFRESH_EXPIRATION_IN,

    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    DATABASE_URL: process.env.DATABASE_URL,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    PHOTO_STORAGE_PATH: process.env.PHOTO_STORAGE_PATH,
    PHOTOS_STORAGE_SUBFOLDER: process.env.PHOTOS_STORAGE_SUBFOLDER,
    THUMBNAILS_STORAGE_SUBFOLDER: process.env.THUMBNAILS_STORAGE_SUBFOLDER,
  };

  for (const [key, value] of Object.entries(env)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return env as Record<keyof typeof env, string>;
}

export interface AppConfig {
  port: number;

  jwt: {
    secret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };

  database: {
    user: string;
    password: string;
    db: string;
    port: number;
    url: string;
  };

  redis: {
    host: string;
    port: number;
  };

  storage: {
    path: string;
    photosSubfolder: string;
    thumbnailsSubfolder: string;
  };
}

export const appConfig = (): AppConfig => {
  const env = loadEnv();

  return {
    port: parseInt(env.PORT, 10),

    jwt: {
      secret: env.JWT_SECRET,
      accessExpiration: env.JWT_ACCESS_EXPIRATION_IN,
      refreshExpiration: env.JWT_REFRESH_EXPIRATION_IN,
    },

    database: {
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      db: env.POSTGRES_DB,
      port: parseInt(env.POSTGRES_PORT, 10),
      url: env.DATABASE_URL,
    },

    storage: {
      path: env.PHOTO_STORAGE_PATH,
      photosSubfolder: env.PHOTOS_STORAGE_SUBFOLDER,
      thumbnailsSubfolder: env.THUMBNAILS_STORAGE_SUBFOLDER,
    },

    redis: {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT, 10),
    },
  };
};
