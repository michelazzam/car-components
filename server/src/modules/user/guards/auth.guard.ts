import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { REQUEST_USER_KEY } from '../constants/auth';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../user.schema';
import { UserService } from '../user.service';
import { JwtGeneratorService } from '../services/jwt-generator.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtGeneratorService: JwtGeneratorService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);

    // in case the class/method is decorated with @IsPublic, we don't need to check the token
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (accessToken) {
      try {
        // verify the jwt
        const payload =
          await this.jwtGeneratorService.verifyJwtToken(accessToken);

        // get the user
        const user = await this.userService.findOne(payload.id);
        if (!user) throw new UnauthorizedException('User not found');

        // attach to the request
        (request as any)[REQUEST_USER_KEY] = user;

        // checking for role-based authorization
        const contextRoles = this.reflector.getAllAndOverride<UserRole[]>(
          ROLES_KEY,
          [
            context.getHandler(), // to handle methods
            context.getClass(), // to handle classes
          ],
        );

        // no roles specified, allow access
        if (!contextRoles) {
          return true;
        }

        // check if the user has the required role
        return contextRoles.includes(user.role);
      } catch (error) {
        if (!isPublic) {
          throw new UnauthorizedException('Invalid access token');
        } else {
          return true;
        }
      }
    } else if (!isPublic) {
      throw new UnauthorizedException('Unauthenticated');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
