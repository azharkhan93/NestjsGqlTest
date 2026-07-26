import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@common/domain/enums';
import { VendorProfileService } from '@modules/vendors/application/services/vendor-profile';
import { IAvailabilityRepository } from '@modules/vendors/availability/domain/repositories';
import {
  VendorAvailabilityEntity,
  VendorBreakEntity,
  VendorExceptionEntity,
} from '@modules/vendors/availability/domain/entities';

export interface AuthenticatedUserPayload {
  sub: string;
  role?: string | { name?: string };
  email?: string;
}

export interface SaveFullAvailabilityInput {
  schedule?: Partial<VendorAvailabilityEntity>[];
  breaks?: Partial<VendorBreakEntity>[];
  exceptions?: Partial<VendorExceptionEntity>[];
}

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly repository: IAvailabilityRepository,
    private readonly vendorProfileService: VendorProfileService,
  ) {}

  private async validate(
    user: AuthenticatedUserPayload,
    vendorId?: string,
    item?: {
      type: 'vendorAvailability' | 'vendorBreak' | 'vendorException';
      id: string;
    },
  ): Promise<void> {
    const userRole =
      typeof user.role === 'string' ? user.role : user.role?.name;
    if (userRole === UserRole.SUPER_ADMIN) return;

    let targetId = vendorId;
    if (item) {
      targetId =
        (await this.repository.getVendorProfileIdForAvailabilityItem(
          item.type,
          item.id,
        )) ?? undefined;
    }

    const profile = await this.vendorProfileService.findByUserId(user.sub);
    if (!targetId || !profile || profile.id !== targetId) {
      throw new ForbiddenException(
        'You do not have permission to manage this vendor availability',
      );
    }
  }

  async getAvailability(
    user: AuthenticatedUserPayload,
    vendorId: string,
  ): Promise<{
    schedule: VendorAvailabilityEntity[];
    breaks: VendorBreakEntity[];
    exceptions: VendorExceptionEntity[];
  }> {
    await this.validate(user, vendorId);
    return this.repository.getVendorAvailability(vendorId);
  }

  async saveFullAvailability(
    user: AuthenticatedUserPayload,
    vendorId: string,
    input: SaveFullAvailabilityInput,
  ): Promise<{
    schedule: VendorAvailabilityEntity[];
    breaks: VendorBreakEntity[];
    exceptions: VendorExceptionEntity[];
  }> {
    await this.validate(user, vendorId);
    await this.repository.upsertSchedule(vendorId, input.schedule ?? []);
    await this.repository.syncBreaks(vendorId, input.breaks ?? []);
    await this.repository.syncExceptions(vendorId, input.exceptions ?? []);
    return this.repository.getVendorAvailability(vendorId);
  }

  async updateSchedule(
    user: AuthenticatedUserPayload,
    vendorId: string,
    schedule: Partial<VendorAvailabilityEntity>[],
  ): Promise<{
    schedule: VendorAvailabilityEntity[];
    breaks: VendorBreakEntity[];
    exceptions: VendorExceptionEntity[];
  }> {
    await this.validate(user, vendorId);
    await this.repository.upsertSchedule(vendorId, schedule);
    return this.repository.getVendorAvailability(vendorId);
  }

  async updateScheduleItem(
    user: AuthenticatedUserPayload,
    id: string,
    data: Partial<VendorAvailabilityEntity>,
  ): Promise<VendorAvailabilityEntity> {
    await this.validate(user, undefined, { type: 'vendorAvailability', id });
    return this.repository.updateScheduleItem(id, data);
  }

  // --- Breaks ---

  async addBreak(
    user: AuthenticatedUserPayload,
    vendorId: string,
    data: Partial<VendorBreakEntity>,
  ): Promise<VendorBreakEntity> {
    await this.validate(user, vendorId);
    return this.repository.addBreak(vendorId, data);
  }

  async updateBreak(
    user: AuthenticatedUserPayload,
    id: string,
    data: Partial<VendorBreakEntity>,
  ): Promise<VendorBreakEntity> {
    await this.validate(user, undefined, { type: 'vendorBreak', id });
    return this.repository.updateBreak(id, data);
  }

  async removeBreak(
    user: AuthenticatedUserPayload,
    id: string,
  ): Promise<boolean> {
    await this.validate(user, undefined, { type: 'vendorBreak', id });
    return this.repository.removeBreak(id).then(() => true);
  }

  // --- Exceptions ---

  async addException(
    user: AuthenticatedUserPayload,
    vendorId: string,
    data: Partial<VendorExceptionEntity>,
  ): Promise<VendorExceptionEntity> {
    await this.validate(user, vendorId);
    return this.repository.addException(vendorId, data);
  }

  async updateException(
    user: AuthenticatedUserPayload,
    id: string,
    data: Partial<VendorExceptionEntity>,
  ): Promise<VendorExceptionEntity> {
    await this.validate(user, undefined, { type: 'vendorException', id });
    return this.repository.updateException(id, data);
  }

  async removeException(
    user: AuthenticatedUserPayload,
    id: string,
  ): Promise<boolean> {
    await this.validate(user, undefined, { type: 'vendorException', id });
    return this.repository.removeException(id).then(() => true);
  }
}
