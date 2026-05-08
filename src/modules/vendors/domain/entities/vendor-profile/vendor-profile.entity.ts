import { BaseEntity } from '@common/domain/entities';

export class VendorProfileEntity extends BaseEntity {
  userId: string;
  businessName: string;
  imageUri?: string;
  gstNumber?: string;
  contactNumber?: string;
  address?: string;
  serviceRadius?: string;
  operatingHours?: string;
  deletedAt?: Date;

  constructor(partial: Partial<VendorProfileEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<VendorProfileEntity>): VendorProfileEntity {
    return new VendorProfileEntity(data);
  }
}
