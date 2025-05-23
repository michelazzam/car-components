import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnvConfigService } from 'src/config/env.validation';
import { fetchApi } from 'src/utils/fetchApi';

@Injectable()
export class TelegramService {
  private readonly telegramApiToken: string;
  private readonly chatId: string;

  constructor(private readonly configService: EnvConfigService) {
    this.telegramApiToken = this.configService.get('TELEGRAM_API_TOKEN')!;
    this.chatId = this.configService.get('CHAT_ID')!;
  }
  async sendTelegramMessage(message: string): Promise<any> {
    if (!message) {
      console.error('Message is required');
      return;
    }

    const url = `https://api.telegram.org/bot${this.telegramApiToken}/sendMessage`;
    const payload = {
      chat_id: this.chatId,
      text: message,
      parse_mode: 'Markdown',
    };

    try {
      const response = await fetchApi(url, { method: 'POST', body: payload });
      return response.data;
    } catch (error: any) {
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
