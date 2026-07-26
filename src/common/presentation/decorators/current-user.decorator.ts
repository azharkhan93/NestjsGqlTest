import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CurrentUserPayload } from '../../domain/interfaces/current-user-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as CurrentUserPayload | undefined;
    return data && user ? user[data] : user;
  },
);
