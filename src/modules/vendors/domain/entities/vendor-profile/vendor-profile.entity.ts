import { BaseEntity } from '@common/domain/entities';
import { ServiceCategoryEntity } from '@modules/cms/service-category/domain/entities/service-category.entity';

export class VendorProfileEntity extends BaseEntity {
  userId: string;
  businessName: string;
  imageUri?: string;
  gstNumber?: string;
  contactNumber?: string;
  address?: string;
  serviceRadius?: string;
  operatingHours?: string;
  description?: string;
  whyChooseMe?: string;
  images?: string[];
  categoryIds?: string[];
  categories?: ServiceCategoryEntity[];
  deletedAt?: Date;

  constructor(partial: Partial<VendorProfileEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<VendorProfileEntity>): VendorProfileEntity {
    return new VendorProfileEntity(data);
  }
}
