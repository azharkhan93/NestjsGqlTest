import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IVendorServiceRepository } from '@modules/vendors/vendor-services/domain/repositories';
import { VendorServiceEntity } from '@modules/vendors/vendor-services/domain/entities';

@Injectable({ scope: Scope.REQUEST })
export class ServiceDataLoader {
  private readonly loader: DataLoader<string, VendorServiceEntity | null>;

  constructor(private readonly serviceRepository: IVendorServiceRepository) {
    this.loader = new DataLoader<string, VendorServiceEntity | null>(
      async (serviceIds: readonly string[]) => {
        const services = await this.serviceRepository.findByIds([
          ...serviceIds,
        ]);
        const serviceMap = new Map<string, VendorServiceEntity>();
        services.forEach((s) => {
          if (s) serviceMap.set(s.id, s);
        });
        return serviceIds.map((id) => serviceMap.get(id) ?? null);
      },
    );
  }

  async load(serviceId: string): Promise<VendorServiceEntity | null> {
    return this.loader.load(serviceId);
  }
}
