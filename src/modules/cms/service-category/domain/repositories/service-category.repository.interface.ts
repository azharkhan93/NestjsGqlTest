import { IRepository } from '@common/domain/repositories/repository.interface';
import { ServiceCategoryEntity } from '../entities';

export abstract class IServiceCategoryRepository extends IRepository<ServiceCategoryEntity> {
  abstract createBulk(
    categories: ServiceCategoryEntity[],
  ): Promise<ServiceCategoryEntity[]>;
  abstract findById(id: string): Promise<ServiceCategoryEntity | null>;
  abstract delete(id: string): Promise<void>;
  abstract syncBulk(
    categories: Partial<ServiceCategoryEntity>[],
  ): Promise<ServiceCategoryEntity[]>;
}
