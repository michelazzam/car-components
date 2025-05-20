import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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
import {
  PermissionModuleAction,
  PermissionModuleName,
} from '../interfaces/user.permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

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

        // Checking for permission-based authorization
        const requiredPermissions = this.reflector.getAllAndOverride<{
          moduleName: PermissionModuleName;
          moduleAction: PermissionModuleAction;
        }>(PERMISSIONS_KEY, [
          context.getHandler(), // to handle methods
          context.getClass(), // to handle classes
        ]);

        // No roles or permissions specified, allow access
        if (!contextRoles && !requiredPermissions) {
          return true;
        }

        // Check if the user has the required role
        if (contextRoles && !contextRoles.includes(user.role)) {
          throw new ForbiddenException();
        }

        // Check if the user has the required permission
        if (requiredPermissions) {
          const { moduleName, moduleAction } = requiredPermissions;
          const userPermissions = user.permissions;

          // if admin/superAdmin, skip permission check
          if (user.role === 'admin' || user.role === 'superAmsAdmin') {
            return true;
          }

          // Check if the user has the required permission for the given module and action
          if (
            !userPermissions?.[moduleName] ||
            !userPermissions?.[moduleName]?.[moduleAction]
          ) {
            throw new ForbiddenException(
              `Insufficient permission: ${moduleName}:${moduleAction}`,
            );
          }
        }

        return true;
      } catch (error) {
        if (!isPublic) {
          if (error?.status === 403)
            throw new ForbiddenException(error?.message);

          throw new UnauthorizedException(error?.message);
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
