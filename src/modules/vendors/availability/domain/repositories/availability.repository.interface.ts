import {
  VendorAvailabilityEntity,
  VendorBreakEntity,
  VendorExceptionEntity,
} from '../entities';

export abstract class IAvailabilityRepository {
  abstract getVendorAvailability(vendorProfileId: string): Promise<{
    schedule: VendorAvailabilityEntity[];
    breaks: VendorBreakEntity[];
    exceptions: VendorExceptionEntity[];
  }>;

  abstract upsertSchedule(
    vendorProfileId: string,
    schedule: Partial<VendorAvailabilityEntity>[],
    tx?: any,
  ): Promise<void>;
  abstract syncBreaks(
    vendorProfileId: string,
    breaks: Partial<VendorBreakEntity>[],
    tx?: any,
  ): Promise<void>;
  abstract syncExceptions(
    vendorProfileId: string,
    exceptions: Partial<VendorExceptionEntity>[],
    tx?: any,
  ): Promise<void>;

  abstract addBreak(
    vendorProfileId: string,
    data: Partial<VendorBreakEntity>,
  ): Promise<VendorBreakEntity>;
  abstract removeBreak(id: string): Promise<void>;
  abstract addException(
    vendorProfileId: string,
    data: Partial<VendorExceptionEntity>,
  ): Promise<VendorExceptionEntity>;
  abstract removeException(id: string): Promise<void>;
}
