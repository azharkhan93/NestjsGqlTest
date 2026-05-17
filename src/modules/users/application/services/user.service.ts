import { Injectable, BadRequestException } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { VerificationService } from '@modules/verification/application/services/verification.service';
import { RolesService } from '@modules/roles/application/services/roles.service';
import { UserRole } from '@common/domain/enums';
import { PasetoService } from '@common/application/security/paseto.service';
import { CloudinaryService } from '@common/application/services/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: IUserRepository,
    private readonly verificationService: VerificationService,
    private readonly rolesService: RolesService,
    private readonly pasetoService: PasetoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async loginByPhone(
    phoneNumber: string,
    code: string,
    roleName: UserRole,
  ): Promise<{ token: string; user: UserEntity }> {
    const isVerified = await this.verificationService.verifyOtp(
      phoneNumber,
      code,
    );
    if (!isVerified.success) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    let user = await this.repository.findByPhoneNumber(phoneNumber);

    if (!user) {
      const role = await this.rolesService.findByName(roleName);
      user = await this.repository.create(
        UserEntity.create({
          phoneNumber,
          roleId: role.id,
        }),
      );
    }

    const token = await this.pasetoService.sign({
      sub: user.id,
      role: roleName,
    });

    return { token, user };
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<UserEntity> {
    return assertFound(await this.repository.findOne(id), `User ${id}`);
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.findById(id);

    // 1. Delete avatar from Cloudinary if exists
    if (user.avatarPublicId) {
      await this.cloudinaryService.deleteFile(user.avatarPublicId);
    }

    // 2. Delete user from repository
    assertFound(await this.repository.remove(id), `User ${id}`);
    return true;
  }
}
