import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserData } from '../interfaces/user-data.interface';
import { REQUEST_USER_KEY } from '../constants/auth';

// 💡 This decorator is used to extract the user data from the request object
export const User = createParamDecorator(
  (field: keyof UserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
