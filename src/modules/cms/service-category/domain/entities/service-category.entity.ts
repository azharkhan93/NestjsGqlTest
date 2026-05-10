import { BaseEntity } from "@common/domain/entities";

export class ServiceCategoryEntity extends BaseEntity {
  name: string;
  icon: string;
  deletedAt?: Date | null;

  constructor(partial: Partial<ServiceCategoryEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<ServiceCategoryEntity>): ServiceCategoryEntity {
    return new ServiceCategoryEntity(data);
  }
}
