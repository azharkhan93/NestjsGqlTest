import { BaseEntity } from '@common/domain/entities';

export class VendorAvailabilityEntity extends BaseEntity {
  vendorProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;

  constructor(partial: Partial<VendorAvailabilityEntity>) {
    super();
    Object.assign(this, partial);
  }
}

export class VendorBreakEntity extends BaseEntity {
  vendorProfileId: string;
  name: string;
  startTime: string;
  endTime: string;

  constructor(partial: Partial<VendorBreakEntity>) {
    super();
    Object.assign(this, partial);
  }
}

export enum ExceptionType {
  BLOCKED_OUT = 'BLOCKED_OUT',
  SHORTENED_HOURS = 'SHORTENED_HOURS',
}

export class VendorExceptionEntity extends BaseEntity {
  vendorProfileId: string;
  date: Date;
  description?: string | null;
  type: ExceptionType;
  startTime?: string | null;
  endTime?: string | null;

  constructor(partial: Partial<VendorExceptionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
