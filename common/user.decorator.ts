import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);