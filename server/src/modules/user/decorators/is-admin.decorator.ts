import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for marking a route handler as admin-only.
 */
export const IS_ADMIN_KEY = 'isAdmin';

/**
 * Decorator that marks a route handler as accessible only to admin users.
 *
 * @returns {MethodDecorator} A decorator function to be used on route handlers.
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @IsAdmin()
 * getProfile() {
 *   // This route is only accessible to admin users
 * }
 * ```
 */
export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
