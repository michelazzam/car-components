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
    const existingToken = await this.appTokenModel.findOne();
    if (existingToken) {
      await this.appTokenModel.findOneAndUpdate(
        { _id: existingToken._id },
        { token, lastValidatedAt: new Date() },
      );
    } else
      await this.appTokenModel.create({ token, lastValidatedAt: new Date() });
  }

  async isTokenValid() {
    // find the token from db to check if the app has contacted our server
    const tokenObj = await this.appTokenModel.findOne();
    if (!tokenObj) return { isValid: false };

    // check if the lastValidatedAt is less than 20 days ago
    const isValid =
      tokenObj!.lastValidatedAt >
      new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);

    if (!isValid) {
      // if false & there is internet try to validate it again
      const hasInternet = await this.hasInternetConnection();
      if (hasInternet) {
        await this.validateTokenWithServer(tokenObj.token);

        // update the lastValidatedAt field
        await this.appTokenModel.findOneAndUpdate(
          { _id: tokenObj._id },
          { lastValidatedAt: new Date() },
        );

        return { isValid: true };
      } else {
        return {
          isValid: false,
          message: 'Please connect to the internet to validate your license.',
        };
      }
    }

    return { isValid: true };
  }

  async getBilling() {
    try {
      const tokenObj = await this.appTokenModel.findOne();
      if (!tokenObj) throw new BadRequestException('Token not found');

      const response = await axios.get(
        `${this.configService.get('AMS_SERVER_URL')}/get-client-invoices`,
        {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error.response);
      throw new BadRequestException(error.response.data.message);
    }
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

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data.message);
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
