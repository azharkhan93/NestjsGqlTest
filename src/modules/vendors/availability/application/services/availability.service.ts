import { Injectable } from '@nestjs/common';
import { IAvailabilityRepository } from '@modules/vendors/availability/domain/repositories';
import { 
  VendorAvailabilityEntity, 
  VendorBreakEntity, 
  VendorExceptionEntity 
} from '@modules/vendors/availability/domain/entities';

@Injectable()
export class AvailabilityService {
  constructor(private readonly repository: IAvailabilityRepository) {}

  async getAvailability(vendorProfileId: string) {
    return this.repository.getVendorAvailability(vendorProfileId);
  }

  async updateSchedule(vendorProfileId: string, schedule: Partial<VendorAvailabilityEntity>[]) {
    await this.repository.saveSchedule(vendorProfileId, schedule);
    return this.getAvailability(vendorProfileId);
  }

  async addBreak(vendorProfileId: string, data: Partial<VendorBreakEntity>) {
    return this.repository.addBreak(vendorProfileId, data);
  }

  async removeBreak(id: string) {
    await this.repository.removeBreak(id);
    return true;
  }

  async addException(vendorProfileId: string, data: Partial<VendorExceptionEntity>) {
    return this.repository.addException(vendorProfileId, data);
  }

  async removeException(id: string) {
    await this.repository.removeException(id);
    return true;
  }
}
