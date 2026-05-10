import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AdminService } from '@modules/admin/application/services/admin.service';
import { AdminAuthPayloadType } from '../types/admin-auth-payload.type';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => AdminAuthPayloadType)
  async adminLogin(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.adminService.login(email, password);
  }
}
