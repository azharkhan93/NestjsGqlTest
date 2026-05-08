import { Injectable, BadRequestException } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { VerificationService } from '@modules/verification/application/services/verification.service';
import { RolesService } from '@modules/roles/application/services/roles.service';
import { UserRole } from '@common/domain/enums';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: IUserRepository,
    private readonly verificationService: VerificationService,
    private readonly rolesService: RolesService,
  ) {}

  async loginByPhone(phoneNumber: string, code: string, roleName: UserRole): Promise<UserEntity> {
    const isVerified = await this.verificationService.verifyOtp(phoneNumber, code);
    if (!isVerified.success) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    let user = await this.repository.findByPhoneNumber(phoneNumber);

    if (!user) {
      const role = await this.rolesService.findByName(roleName);
      user = await this.repository.create(UserEntity.create({
        phoneNumber,
        roleId: role.id,
      }));
    }

    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<UserEntity> {
    return assertFound(await this.repository.findOne(id), `User ${id}`);
  }

  async delete(id: string): Promise<boolean> {
    assertFound(await this.repository.remove(id), `User ${id}`);
    return true;
  }
}
