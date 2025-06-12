import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TelegramService } from 'src/lib/telegram.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly telegramService: TelegramService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle HttpException instances
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const excMsg = (exceptionResponse as any).message;
        message = Array.isArray(excMsg) ? excMsg.join(', ') : excMsg;
      } else {
        message = JSON.stringify(exceptionResponse);
      }
    }
    // Handle MongoDB duplicate key error
    else if (
      typeof exception === 'object' &&
      exception !== null &&
      (exception as any).code === 11000
    ) {
      message = generateDuplicateFieldMessage(exception);
      status = HttpStatus.BAD_REQUEST;
    }

    // Handle generic Error instances
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // notify us on telegram
    const telegramErrorMessage =
      `${request.method} ${request.url}:\n` + message;

    this.telegramService.sendTelegramMessage(telegramErrorMessage);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

function generateDuplicateFieldMessage(errorResponse: any): string {
  const key = Object.keys(errorResponse.keyPattern)[0];
  const value = errorResponse.keyValue[key];

  return `The ${key} ${value} already exists.`;
}
