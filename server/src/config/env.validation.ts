import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  BACKUP_DATABASE_URL: string;

  @IsString()
  AMS_SERVER_URL: string;

  @IsString()
  TELEGRAM_API_TOKEN: string;

  @IsString()
  CHAT_ID: string;

  @IsString()
  CLIENT_CHAT_ID: string;
}

// To be used when we want to get env variables in our Modules
export class EnvConfigService extends ConfigService<EnvironmentVariables> {}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
