import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JWT_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_EXPIRATION,
} from '../constants/auth';

interface JwtPayload {
  id: string;
}

@Injectable()
export class JwtGeneratorService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyJwtToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: JWT_SECRET,
    });
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_SECRET,
      expiresIn:
        process.env.NODE_ENV === 'development' // in dev increase jwt expiration time
          ? 100000
          : JWT_ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
