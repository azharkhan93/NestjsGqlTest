import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { RolesService } from '@modules/roles/application/services/roles.service';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserRole } from '@common/domain/enums';
import { PasetoService } from '@common/application/security/paseto.service';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly rolesService: RolesService,
    private readonly pasetoService: PasetoService,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await this.userRepository.findByEmail(adminEmail);

    if (existingAdmin) {
      console.log('✅ Super Admin already exists');
      return;
    }

    try {
      const role = await this.rolesService.create(UserRole.SUPER_ADMIN);
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await this.userRepository.create(
        UserEntity.create({
          email: adminEmail,
          password: hashedPassword,
          roleId: role.id,
          name: 'Super Admin',
        }),
      );

      console.log('🚀 Super Admin seeded successfully');
    } catch (error) {
      console.error('❌ Failed to seed Super Admin:', error.message);
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: UserEntity }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.pasetoService.sign({
      sub: user.id,
      role: UserRole.SUPER_ADMIN,
    });

    return { token, user };
  }
}
