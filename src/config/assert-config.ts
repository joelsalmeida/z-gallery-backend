import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  /* =======================
   * APP
   * ======================= */

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number;

  /* =======================
   * AUTH / JWT
   * ======================= */

  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d+(ms|s|m|h|d|w|y)?$/, {
    message:
      'JWT_ACCESS_EXPIRATION_IN must be a valid ms string (e.g. 60s, 5m, 1h)',
  })
  JWT_ACCESS_EXPIRATION_IN?: string = '60s';

  @IsString()
  @Matches(/^\d+(ms|s|m|h|d|w|y)?$/, {
    message:
      'JWT_REFRESH_EXPIRATION_IN must be a valid ms string (e.g. 60s, 5m, 1h)',
  })
  JWT_REFRESH_EXPIRATION_IN: string;

  /* =======================
   * DATABASE (Postgres)
   * ======================= */

  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DB: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  POSTGRES_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  /* =======================
   * WAIT-FOR-DB SCRIPT
   * ======================= */

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  /* =======================
   * REDIS
   * ======================= */

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  REDIS_PORT: number;

  /* =======================
   * FILE STORAGE
   * ======================= */

  @IsString()
  @IsNotEmpty()
  PHOTO_STORAGE_PATH: string;

  @IsString()
  @IsNotEmpty()
  PHOTOS_STORAGE_SUBFOLDER: string;

  @IsString()
  @IsNotEmpty()
  THUMBNAILS_STORAGE_SUBFOLDER: string;
}

export function assertConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      errors
        .map((error) => Object.values(error.constraints ?? {}).join(', '))
        .join('; '),
    );
  }

  return validatedConfig;
}
