import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { VerificationService } from '@modules/verification/application/services/verification.service';
import { RolesService } from '@modules/roles/application/services/roles.service';
import { UserRole } from '@modules/roles/domain/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: IUserRepository,
    private readonly verificationService: VerificationService,
    private readonly rolesService: RolesService,
  ) {}

  async loginByPhone(phoneNumber: string, code: string, roleName: UserRole): Promise<UserEntity> {
    // 1. Verify OTP using the existing VerificationModule logic
    const isVerified = await this.verificationService.verifyOtp(phoneNumber, code);
    if (!isVerified.success) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // 2. Find or Create User
    let user = await this.repository.findByPhoneNumber(phoneNumber);
    
    if (!user) {
      // Get role ID from RolesService
      const role = await this.rolesService.findByName(roleName);
      user = await this.repository.create(UserEntity.create({ 
        phoneNumber, 
        roleId: role.id 
      }));
    }

    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.repository.remove(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return true;
  }
}
