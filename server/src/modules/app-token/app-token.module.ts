import { Module } from '@nestjs/common';
import { AppTokenService } from './app-token.service';
import { AppTokenController } from './app-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppToken, AppTokenSchema } from './app-token.schema';
import { EnvConfigService } from 'src/config/env.validation';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: AppToken.name, schema: AppTokenSchema },
    ]),
  ],
  controllers: [AppTokenController],
  providers: [AppTokenService, EnvConfigService],
})
export class AppTokenModule {}
