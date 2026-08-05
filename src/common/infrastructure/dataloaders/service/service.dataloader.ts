import { Injectable, Scope } from '@nestjs/common';
import { BaseDataLoader } from '../base.dataloader';
import { IVendorServiceRepository } from '@modules/vendors/vendor-services/domain/repositories';
import { VendorServiceEntity } from '@modules/vendors/vendor-services/domain/entities';

@Injectable({ scope: Scope.REQUEST })
export class ServiceDataLoader extends BaseDataLoader<VendorServiceEntity> {
  constructor(serviceRepository: IVendorServiceRepository) {
    super(serviceRepository);
  }
}
