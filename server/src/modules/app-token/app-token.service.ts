import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AppToken, IAppToken } from './app-token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EnvConfigService } from 'src/config/env.validation';
import { ValidateAppTokenDto } from './dto/validate-app-token.dto';
import { fetchApi } from 'src/utils/fetchApi';

@Injectable()
export class AppTokenService {
  constructor(
    @InjectModel(AppToken.name)
    private appTokenModel: Model<IAppToken>,
    private readonly configService: EnvConfigService,
  ) {}

  async validateTokenAndSave(dto: ValidateAppTokenDto) {
    try {
      const { token } = dto;

      await this.validateTokenWithServer(token);

      // if passed the validation, save the token to the database
      const existingToken = await this.appTokenModel.findOne();

      if (existingToken) {
        await this.appTokenModel.findOneAndUpdate(
          { _id: existingToken._id },
          { token, lastValidatedAt: new Date() },
        );
      } else {
        await this.appTokenModel.create({ token, lastValidatedAt: new Date() });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          error.message || 'Failed to validate token',
        );
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  async isTokenValid() {
    try {
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
    } catch (error) {
      return {
        isValid: false,
        message:
          error.message || 'An error occurred while validating the token.',
      };
    }
  }

  async getBilling() {
    try {
      const tokenObj = await this.appTokenModel.findOne();
      if (!tokenObj) throw new NotFoundException('Token not found');

      const response = await fetchApi(
        `${this.configService.get('AMS_SERVER_URL')}/get-client-invoices`,
        {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`,
          },
        },
      );

      if (response.error) {
        throw new InternalServerErrorException(response.error);
      }

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async validateTokenWithServer(token: string) {
    try {
      const amsUrl = this.configService.get('AMS_SERVER_URL');

      const response = await fetchApi(`${amsUrl}/projects/validate-token`, {
        method: 'POST',
        body: { token },
      });

      if (response.error) {
        throw new InternalServerErrorException(response.error);
      }

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to validate token with server',
      );
    }
  }

  private async hasInternetConnection(): Promise<boolean> {
    const response = await fetchApi('https://www.google.com', {
      method: 'GET',
    });

    if (response.error) {
      return false;
    }

    return true;
  }
}
