import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { UserService } from './application/services/user.service';
import { UserResolver } from './presentation/graphql/resolvers/user.resolver';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/user.repository';
import { VerificationModule } from '@modules/verification/verification.module';
import { RolesModule } from '@modules/roles/roles.module';

@Module({
  imports: [
    CommonModule,
    VerificationModule,
    RolesModule
  ],
  providers: [
    UserService,
    UserResolver,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}
