import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnvConfigService } from 'src/config/env.validation';
import { fetchApi } from 'src/utils/fetchApi';

@Injectable()
export class TelegramService {
  private readonly telegramApiToken: string;
  private readonly chatId: string;
  private readonly clientChatId: string;

  constructor(private readonly configService: EnvConfigService) {
    this.telegramApiToken = this.configService.get('TELEGRAM_API_TOKEN')!;
    this.chatId = this.configService.get('CHAT_ID')!;
    this.clientChatId = this.configService.get('CLIENT_CHAT_ID')!;
  }

  async sendTelegramMessage(
    message: string,
    toProdGroup = false,
  ): Promise<any> {
    if (!message) {
      console.error('Message is required');
      return;
    }
    const isDev = this.configService.get('NODE_ENV') === 'development';
    // only take it into consideration if it's not a dev environment
    const sendToProdGroup = isDev ? false : toProdGroup;

    const url = `https://api.telegram.org/bot${this.telegramApiToken}/sendMessage`;
    const payload = {
      chat_id: sendToProdGroup ? this.clientChatId : this.chatId,
      text: sendToProdGroup
        ? message
        : `Car Components - ${this.configService.get('NODE_ENV')}: ${message}`,
      parse_mode: 'Markdown',
    };

    try {
      const response = await fetchApi(url, { method: 'POST', body: payload });
      return response.data;
    } catch (error: any) {
      console.log(error);
      let message = 'Internal server error';

      if (error.response) {
        message = `Error response from Telegram: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        message = `No response received from Telegram: ${JSON.stringify(error.request)}`;
      } else {
        message = `Error sending message to Telegram: ${error.message}`;
      }

      throw new InternalServerErrorException(message);
    }
  }
}
