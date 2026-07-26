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
    tx?: unknown,
  ): Promise<void>;
  abstract updateScheduleItem(
    id: string,
    data: Partial<VendorAvailabilityEntity>,
  ): Promise<VendorAvailabilityEntity>;
  abstract syncBreaks(
    vendorProfileId: string,
    breaks: Partial<VendorBreakEntity>[],
    tx?: unknown,
  ): Promise<void>;
  abstract syncExceptions(
    vendorProfileId: string,
    exceptions: Partial<VendorExceptionEntity>[],
    tx?: unknown,
  ): Promise<void>;

  abstract addBreak(
    vendorProfileId: string,
    data: Partial<VendorBreakEntity>,
  ): Promise<VendorBreakEntity>;
  abstract updateBreak(
    id: string,
    data: Partial<VendorBreakEntity>,
  ): Promise<VendorBreakEntity>;
  abstract getVendorProfileIdForAvailabilityItem(
    type: 'vendorAvailability' | 'vendorBreak' | 'vendorException',
    id: string,
  ): Promise<string | null>;

  abstract removeBreak(id: string): Promise<void>;
  abstract addException(
    vendorProfileId: string,
    data: Partial<VendorExceptionEntity>,
  ): Promise<VendorExceptionEntity>;
  abstract updateException(
    id: string,
    data: Partial<VendorExceptionEntity>,
  ): Promise<VendorExceptionEntity>;
  abstract removeException(id: string): Promise<void>;
}
