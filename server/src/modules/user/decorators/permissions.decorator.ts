import { SetMetadata } from '@nestjs/common';
import { userPermissions } from '../interfaces/user.permissions';

// Type for the keys (resource names)
export type PermissionModuleName = keyof typeof userPermissions;

// Type for possible actions
export type PermissionModuleAction = 'create' | 'read' | 'update';

export const PERMISSIONS_KEY = 'permissions';

// Permissions decorator that takes module name and action type
export const Permissions = (
  moduleName: PermissionModuleName,
  moduleAction: PermissionModuleAction,
) => SetMetadata(PERMISSIONS_KEY, { moduleName, moduleAction });
