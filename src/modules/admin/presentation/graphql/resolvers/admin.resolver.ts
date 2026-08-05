import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AdminService } from '@modules/admin/application/services/admin.service';
import { AdminAuthPayloadType } from '../types/admin-auth-payload.type';
import type { Response } from 'express';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => AdminAuthPayloadType)
  async adminLogin(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context('res') res: Response,
  ) {
    const { token, user } = await this.adminService.login(email, password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });
    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Context('res') res: Response) {
    res.clearCookie('token');
    return true;
  }
}
