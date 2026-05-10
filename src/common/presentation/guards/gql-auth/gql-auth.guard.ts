import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PasetoService } from '@common/application/security/paseto.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly pasetoService: PasetoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    const payload = await this.pasetoService.verify(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    req.user = payload;
    return true;
  }
}
