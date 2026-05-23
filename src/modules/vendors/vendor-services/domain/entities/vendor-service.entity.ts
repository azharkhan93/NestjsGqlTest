import { BaseEntity } from '@common/domain/entities';

export interface ServicePricingDomain {
  categoryId: string;
  price: number;
}

export class VendorServiceEntity extends BaseEntity {
  vendorProfileId: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  location?: string | null;
  features: string[];
  images: string[];
  categoryId?: string | null;
  availableAtHome: boolean;
  availableAtCenter: boolean;
  pricings?: ServicePricingDomain[];
  deletedAt?: Date | null;

  constructor(partial: Partial<VendorServiceEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<VendorServiceEntity>): VendorServiceEntity {
    return new VendorServiceEntity(data);
  }
}
