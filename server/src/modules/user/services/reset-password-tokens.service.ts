import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../constants/auth';

@Injectable()
export class ResetPasswordTokensService {
  private tokens: {
    email: string;
    token: string;
    createdAt: Date;
  }[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async generateToken(userId: string, email: string) {
    const token = await this.jwtService.signAsync(
      {
        userId,
      },
      {
        secret: JWT_SECRET,
        expiresIn: 3600000, // 1 hour
      },
    );

    const tokenObj = {
      email,
      token,
      createdAt: new Date(),
    };

    this.tokens.push(tokenObj);

    return tokenObj;
  }

  verifytoken(token: string): { userId: string } | null {
    try {
      const isTokenValid = this.tokens.find(
        (t) =>
          t.token === token && t.createdAt > new Date(Date.now() - 3600000),
      );
      if (!isTokenValid) return null;

      const { userId } = this.jwtService.verify(token, { secret: JWT_SECRET });
      return { userId };
    } catch (error) {
      return null;
    }
  }

  deleteToken(email: string, token: string): void {
    this.tokens = this.tokens.filter(
      (t) => t.email !== email || t.token !== token,
    );
  }

  clearExpiredTokens(): void {
    const now = Date.now();

    // cleared tokens created 1 hour ago
    this.tokens = this.tokens.filter(
      (token) => new Date(token.createdAt).getTime() + 3600000 > now,
    );
  }
}
