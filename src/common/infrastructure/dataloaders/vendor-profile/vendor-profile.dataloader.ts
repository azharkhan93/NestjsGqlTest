import { Injectable, Scope } from '@nestjs/common';
import { BaseDataLoader } from '../base.dataloader';
import { IVendorProfileRepository } from '@modules/vendors/domain/repositories';
import { VendorProfileEntity } from '@modules/vendors/domain/entities';

@Injectable({ scope: Scope.REQUEST })
export class VendorProfileDataLoader extends BaseDataLoader<VendorProfileEntity> {
  constructor(vendorProfileRepository: IVendorProfileRepository) {
    super(vendorProfileRepository);
  }
}
