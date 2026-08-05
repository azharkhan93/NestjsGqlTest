import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PasetoService } from '@common/application/security/paseto.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly pasetoService: PasetoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    let token: string | undefined = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const payload = await this.pasetoService.verify(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    req.user = payload;
    return true;
  }
}
