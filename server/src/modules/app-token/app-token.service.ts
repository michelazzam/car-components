import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
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

  private async validateTokenWithServer(token: string) {
    try {
      const response = await axios.post(
        `${this.configService.get('AMS_SERVER_URL')}/projects/validate-token?token=${token}`,
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data.message);
    }
  }

  private async hasInternetConnection(): Promise<boolean> {
    try {
      await axios.get('https://www.google.com', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
