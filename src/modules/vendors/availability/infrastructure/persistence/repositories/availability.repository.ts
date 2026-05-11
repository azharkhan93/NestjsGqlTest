import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/persistence';
import {
  VendorAvailabilityEntity,
  VendorBreakEntity,
  VendorExceptionEntity,
  ExceptionType,
} from '@modules/vendors/availability/domain/entities';
import { IAvailabilityRepository } from '@modules/vendors/availability/domain/repositories';

@Injectable()
export class AvailabilityRepository implements IAvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: any) {
    return tx || this.prisma;
  }

  async getVendorAvailability(vendorProfileId: string) {
    const [schedule, breaks, exceptions] = await Promise.all([
      this.prisma.vendorAvailability.findMany({
        where: { vendorProfileId },
        orderBy: { dayOfWeek: 'asc' },
      }),
      this.prisma.vendorBreak.findMany({ where: { vendorProfileId } }),
      this.prisma.vendorException.findMany({
        where: { vendorProfileId },
        orderBy: { date: 'asc' },
      }),
    ]);

    return {
      schedule: schedule.map((s) => new VendorAvailabilityEntity(s)),
      breaks: breaks.map((b) => new VendorBreakEntity(b)),
      exceptions: exceptions.map(
        (e) =>
          new VendorExceptionEntity({
            ...e,
            type: e.type as ExceptionType,
          }),
      ),
    };
  }

  async upsertSchedule(
    vendorProfileId: string,
    schedule: Partial<VendorAvailabilityEntity>[],
    tx?: any,
  ): Promise<void> {
    const client = this.getClient(tx);
    await Promise.all(
      schedule.map((s) =>
        client.vendorAvailability.upsert({
          where: {
            vendorProfileId_dayOfWeek: {
              vendorProfileId,
              dayOfWeek: s.dayOfWeek!,
            },
          },
          update: {
            startTime: s.startTime,
            endTime: s.endTime,
            isActive: s.isActive,
          },
          create: {
            vendorProfileId,
            dayOfWeek: s.dayOfWeek!,
            startTime: s.startTime!,
            endTime: s.endTime!,
            isActive: s.isActive ?? true,
          },
        }),
      ),
    );
  }

  async syncBreaks(
    vendorProfileId: string,
    breaks: Partial<VendorBreakEntity>[],
    tx?: any,
  ): Promise<void> {
    const client = this.getClient(tx);
    await client.vendorBreak.deleteMany({ where: { vendorProfileId } });
    if (breaks.length > 0) {
      await client.vendorBreak.createMany({
        data: breaks.map((b) => ({
          vendorProfileId,
          name: b.name!,
          startTime: b.startTime!,
          endTime: b.endTime!,
        })),
      });
    }
  }

  async syncExceptions(
    vendorProfileId: string,
    exceptions: Partial<VendorExceptionEntity>[],
    tx?: any,
  ): Promise<void> {
    const client = this.getClient(tx);
    await client.vendorException.deleteMany({ where: { vendorProfileId } });
    if (exceptions.length > 0) {
      await client.vendorException.createMany({
        data: exceptions.map((e) => ({
          vendorProfileId,
          date: new Date(e.date!),
          description: e.description,
          type: e.type!,
          startTime: e.startTime,
          endTime: e.endTime,
        })),
      });
    }
  }

  async addBreak(vendorProfileId: string, data: Partial<VendorBreakEntity>) {
    const result = await this.prisma.vendorBreak.create({
      data: {
        vendorProfileId,
        name: data.name!,
        startTime: data.startTime!,
        endTime: data.endTime!,
      },
    });
    return new VendorBreakEntity(result);
  }

  async removeBreak(id: string) {
    await this.prisma.vendorBreak.delete({ where: { id } });
  }

  async addException(
    vendorProfileId: string,
    data: Partial<VendorExceptionEntity>,
  ) {
    const result = await this.prisma.vendorException.create({
      data: {
        vendorProfileId,
        date: data.date!,
        description: data.description,
        type: data.type!,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    return new VendorExceptionEntity({
      ...result,
      type: result.type as ExceptionType,
    });
  }

  async removeException(id: string) {
    await this.prisma.vendorException.delete({ where: { id } });
  }
}
