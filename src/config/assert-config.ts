import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
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

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;
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
