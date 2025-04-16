import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RateLimiterService } from '../services/rate-limiter.service';
import { Ipware } from '@fullerstack/nax-ipware';
const ipware = new Ipware();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ipAddress = ipware.getClientIP(request);

    if (ipAddress) {
      // Check if the IP is blocked
      const blockMessage = this.rateLimiterService.blockIfTooManyFailedLogins(
        ipAddress?.ip,
      );
      if (blockMessage) {
        throw new ForbiddenException(blockMessage); // 403 Forbidden
      }
    }

    return true; // Proceed with request if no block
  }
}
