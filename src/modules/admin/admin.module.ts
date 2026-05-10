import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@modules/users/users.module';
import { RolesModule } from '@modules/roles/roles.module';
import { AdminService } from './application/services/admin.service';
import { AdminResolver } from './presentation/graphql/resolvers/admin.resolver';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '@modules/users/infrastructure/persistence/repositories/user.repository';

@Module({
  imports: [CommonModule, RolesModule],
  providers: [
    AdminService,
    AdminResolver,
  
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AdminModule {}
