import { BadRequestException, Injectable } from '@nestjs/common';
import { AppToken, IAppToken } from './app-token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EnvConfigService } from 'src/config/env.validation';
import { ValidateAppTokenDto } from './dto/create-app-token.dto';

@Injectable()
export class AppTokenService {
  constructor(
    @InjectModel(AppToken.name)
    private appTokenModel: Model<IAppToken>,
    private readonly configService: EnvConfigService,
  ) {}

  async validateTokenAndSave(dto: ValidateAppTokenDto) {
    const { token } = dto;

    await this.validateTokenWithServer(token);

    // if passed the validation, save the token to the database
    await this.appTokenModel.create({ token, lastValidatedAt: new Date() });
  }

  async isValid() {
    // find the token from db to check if the app has contacted our server
    const tokenObj = await this.appTokenModel.findOne();
    if (!tokenObj) return { isValid: false };

    // if there is internet, validate with our server
    const hasInternet = await this.hasInternetConnection();
    if (hasInternet) {
      await this.validateTokenWithServer(tokenObj.token);

      // update the lastValidatedAt field
      await this.appTokenModel.findOneAndUpdate(
        { _id: tokenObj._id },
        { lastValidatedAt: new Date() },
      );
    }

    // check if the lastValidatedAt is less than 20 days ago
    const isValid =
      tokenObj!.lastValidatedAt >
      new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);

    return { isValid, token: tokenObj.token };
  }

  private async validateTokenWithServer(token: string): Promise<any> {
    try {
      const url = `${this.configService.get('AMS_SERVER_URL')}/projects/validate-token?token=${encodeURIComponent(token)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new BadRequestException(errorData.message);
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error.message || 'Token validation failed');
    }
  }

  private async hasInternetConnection(): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch('https://www.google.com', {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return response.ok;
    } catch {
      return false;
    }
  }
}
