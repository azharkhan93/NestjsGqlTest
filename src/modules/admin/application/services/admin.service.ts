import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin(): Promise<void> {
    const shouldSeed =
      this.configService.get<string>('SEED_SUPER_ADMIN') === 'true';
    if (!shouldSeed) {
      return;
    }

    const adminEmail = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>(
      'SUPER_ADMIN_PASSWORD',
    );

    if (!adminEmail || !adminPassword) {
      console.warn(
        '⚠️ SEED_SUPER_ADMIN is true, but SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is missing in environment. Aborting super admin seeding.',
      );
      return;
    }

    const existingAdmin = await this.userRepository.findByEmail(adminEmail);

    if (existingAdmin) {
      console.log('✅ Super Admin already exists');
      return;
    }

    try {
      const role = await this.rolesService.create(UserRole.SUPER_ADMIN);
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to seed Super Admin:', errorMessage);
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
