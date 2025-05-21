import { Module } from '@nestjs/common';
import { AppTokenService } from './app-token.service';
import { AppTokenController } from './app-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppToken, AppTokenSchema } from './app-token.schema';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: AppToken.name, schema: AppTokenSchema },
    ]),
  ],
  controllers: [AppTokenController],
  providers: [AppTokenService],
})
export class AppTokenModule {}
