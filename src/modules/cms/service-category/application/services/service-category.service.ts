import { Injectable } from "@nestjs/common";
import { IServiceCategoryRepository } from "@modules/cms/service-category/domain/repositories";
import { ServiceCategoryEntity } from "@modules/cms/service-category/domain/entities";

@Injectable()
export class ServiceCategoryService {
  constructor(private readonly repository: IServiceCategoryRepository) {}

  async getAllCategories(): Promise<ServiceCategoryEntity[]> {
    return this.repository.findAll();
  }

  async createCategory(name: string, icon: string): Promise<ServiceCategoryEntity> {
    const category = ServiceCategoryEntity.create({ name, icon });
    return this.repository.create(category);
  }

  async updateCategory(id: string, name?: string, icon?: string): Promise<ServiceCategoryEntity> {
    const updated = await this.repository.update(id, { name, icon });
    if (!updated) {
      throw new Error(`Service Category with id ${id} not found`);
    }
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.repository.delete(id);
    return true;
  }

  async syncCategories(categories: { name: string, icon: string }[]): Promise<ServiceCategoryEntity[]> {
    return this.repository.syncBulk(categories);
  }
}
