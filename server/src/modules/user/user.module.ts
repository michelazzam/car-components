import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HashingService } from './services/hashing.service';
import { JwtGeneratorService } from './services/jwt-generator.service';
import { JwtService } from '@nestjs/jwt';
import { RateLimiterService } from './services/rate-limiter.service';
import { ResetPasswordTokensService } from './services/reset-password-tokens.service';

@Module({
  imports: [
    // configure User model to be used in this Module
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    HashingService,
    JwtService,
    JwtGeneratorService,
    RateLimiterService,
    ResetPasswordTokensService,
  ],
  // in this way, when other modules import this module they will have access to these services
  exports: [
    UserService,
    JwtService,
    JwtGeneratorService,
    RateLimiterService,
    ResetPasswordTokensService,
  ],
})
export class UserModule {}
