import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Ipware } from '@fullerstack/nax-ipware';
const ipware = new Ipware();

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    const ipAddress = ipware.getClientIP(request);

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;

      //only log unsuccessful requests
      if (statusCode < 400) return;

      this.logger.log({
        method,
        url: originalUrl,
        statusCode,
        userAgent,
        ipAddress,
        statusMessage,
        reqBody: request.body,
        // user: (request as any)[REQUEST_DASHBOARD_USER_KEY]?.name || null,
      });
    });

    next();
  }
}
