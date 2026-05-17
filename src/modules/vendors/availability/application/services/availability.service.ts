import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/persistence';
import { UserRole } from '@common/domain/enums';
import { VendorProfileService } from '@modules/vendors/application/services/vendor-profile';
import { IAvailabilityRepository } from '@modules/vendors/availability/domain/repositories';
import {
  VendorAvailabilityEntity,
  VendorBreakEntity,
  VendorExceptionEntity,
} from '@modules/vendors/availability/domain/entities';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly repository: IAvailabilityRepository,
    private readonly prisma: PrismaService,
    private readonly vendorProfileService: VendorProfileService,
  ) {}

  private async validate(
    user: any,
    vendorId?: string,
    item?: {
      type: 'vendorAvailability' | 'vendorBreak' | 'vendorException';
      id: string;
    },
  ) {
    const userRole =
      typeof user.role === 'string' ? user.role : user.role?.name;
    if (userRole === UserRole.SUPER_ADMIN) return;

    // const userRole = typeof user.role === 'string' ? user.role : user.role?.name;
    // if (userRole === UserRole.SUPER_ADMIN) return;

    let targetId = vendorId;
    if (item) {
      const record = await (this.prisma[item.type] as any).findUnique({
        where: { id: item.id },
        select: { vendorProfileId: true },
      });
      targetId = record?.vendorProfileId;
    }

    const profile = await this.vendorProfileService.findByUserId(user.sub);
    if (!targetId || profile.id !== targetId) {
      throw new ForbiddenException(
        'You do not have permission to manage this vendor availability',
      );
    }
  }

  async getAvailability(user: any, vendorId: string) {
    await this.validate(user, vendorId);
    return this.repository.getVendorAvailability(vendorId);
  }

  async saveFullAvailability(user: any, vendorId: string, input: any) {
    await this.validate(user, vendorId);
    return this.prisma.$transaction(async (tx) => {
      await this.repository.upsertSchedule(vendorId, input.schedule, tx);
      await this.repository.syncBreaks(vendorId, input.breaks, tx);
      await this.repository.syncExceptions(vendorId, input.exceptions, tx);
      return this.repository.getVendorAvailability(vendorId);
    });
  }

  async updateSchedule(
    user: any,
    vendorId: string,
    schedule: Partial<VendorAvailabilityEntity>[],
  ) {
    await this.validate(user, vendorId);
    await this.repository.upsertSchedule(vendorId, schedule);
    return this.repository.getVendorAvailability(vendorId);
  }

  async updateScheduleItem(
    user: any,
    id: string,
    data: Partial<VendorAvailabilityEntity>,
  ) {
    await this.validate(user, undefined, { type: 'vendorAvailability', id });
    return this.repository.updateScheduleItem(id, data);
  }

  // --- Breaks ---

  async addBreak(
    user: any,
    vendorId: string,
    data: Partial<VendorBreakEntity>,
  ) {
    await this.validate(user, vendorId);
    return this.repository.addBreak(vendorId, data);
  }

  async updateBreak(user: any, id: string, data: Partial<VendorBreakEntity>) {
    await this.validate(user, undefined, { type: 'vendorBreak', id });
    return this.repository.updateBreak(id, data);
  }

  async removeBreak(user: any, id: string) {
    await this.validate(user, undefined, { type: 'vendorBreak', id });
    return this.repository.removeBreak(id).then(() => true);
  }

  // --- Exceptions ---

  async addException(
    user: any,
    vendorId: string,
    data: Partial<VendorExceptionEntity>,
  ) {
    await this.validate(user, vendorId);
    return this.repository.addException(vendorId, data);
  }

  async updateException(
    user: any,
    id: string,
    data: Partial<VendorExceptionEntity>,
  ) {
    await this.validate(user, undefined, { type: 'vendorException', id });
    return this.repository.updateException(id, data);
  }

  async removeException(user: any, id: string) {
    await this.validate(user, undefined, { type: 'vendorException', id });
    return this.repository.removeException(id).then(() => true);
  }
}
