import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestUser } from './auth.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();

    return request['user'];
  },
);
