import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppToken, IAppToken } from './app-token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppTokenService {
  constructor(
    @InjectModel(AppToken.name)
    private appTokenModel: Model<IAppToken>,
  ) {}

  async isValid() {
    // find the token from db to check if the app has contacted our server
    const token = await this.appTokenModel.findOne();
    // if (!token) return { isValid: false };

    // if there is internet, validate with our server
    const hasInternet = await this.hasInternetConnection();
    return { hasInternet };

    // check if the lastValidatedAt is less than 20 days ago
    const isValid =
      token!.lastValidatedAt > new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    return { isValid };
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
