import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/persistence';
import { 
  VendorAvailabilityEntity, 
  VendorBreakEntity, 
  VendorExceptionEntity,
  ExceptionType
} from '@modules/vendors/availability/domain/entities';
import { IAvailabilityRepository } from '@modules/vendors/availability/domain/repositories';

@Injectable()
export class AvailabilityRepository implements IAvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getVendorAvailability(vendorProfileId: string) {
    const [schedule, breaks, exceptions] = await Promise.all([
      this.prisma.vendorAvailability.findMany({ where: { vendorProfileId }, orderBy: { dayOfWeek: 'asc' } }),
      this.prisma.vendorBreak.findMany({ where: { vendorProfileId } }),
      this.prisma.vendorException.findMany({ where: { vendorProfileId }, orderBy: { date: 'asc' } }),
    ]);

    return {
      schedule: schedule.map(s => new VendorAvailabilityEntity(s)),
      breaks: breaks.map(b => new VendorBreakEntity(b)),
      exceptions: exceptions.map(e => new VendorExceptionEntity({
        ...e,
        type: e.type as ExceptionType
      })),
    };
  }

  async saveSchedule(vendorProfileId: string, schedule: Partial<VendorAvailabilityEntity>[]): Promise<void> {
    await this.prisma.$transaction(
      schedule.map(s => 
        this.prisma.vendorAvailability.upsert({
          where: { vendorProfileId_dayOfWeek: { vendorProfileId, dayOfWeek: s.dayOfWeek! } },
          update: { startTime: s.startTime, endTime: s.endTime, isActive: s.isActive },
          create: { 
            vendorProfileId, 
            dayOfWeek: s.dayOfWeek!, 
            startTime: s.startTime!, 
            endTime: s.endTime!, 
            isActive: s.isActive ?? true 
          },
        })
      )
    );
  }

  async addBreak(vendorProfileId: string, data: Partial<VendorBreakEntity>) {
    const result = await this.prisma.vendorBreak.create({
      data: {
        vendorProfileId,
        name: data.name!,
        startTime: data.startTime!,
        endTime: data.endTime!,
      }
    });
    return new VendorBreakEntity(result);
  }

  async removeBreak(id: string) {
    await this.prisma.vendorBreak.delete({ where: { id } });
  }

  async addException(vendorProfileId: string, data: Partial<VendorExceptionEntity>) {
    const result = await this.prisma.vendorException.create({
      data: {
        vendorProfileId,
        date: data.date!,
        description: data.description,
        type: data.type!,
        startTime: data.startTime,
        endTime: data.endTime,
      }
    });
    return new VendorExceptionEntity({ ...result, type: result.type as ExceptionType });
  }

  async removeException(id: string) {
    await this.prisma.vendorException.delete({ where: { id } });
  }
}
