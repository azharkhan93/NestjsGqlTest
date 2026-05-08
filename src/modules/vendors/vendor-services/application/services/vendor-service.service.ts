import { Injectable } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { IVendorServiceRepository } from '@modules/vendors/vendor-services/domain/repositories';
import { VendorServiceEntity } from '@modules/vendors/vendor-services/domain/entities';
import { CreateVendorServiceInput, UpdateVendorServiceInput } from '@modules/vendors/vendor-services/presentation/graphql/inputs';

@Injectable()
export class VendorServiceService {
  constructor(private readonly repository: IVendorServiceRepository) {}

  async create(input: CreateVendorServiceInput): Promise<VendorServiceEntity> {
    return this.repository.create(VendorServiceEntity.create(input));
  }

  async update(id: string, input: UpdateVendorServiceInput): Promise<VendorServiceEntity> {
    const service = await this.repository.update(id, input as any);
    return assertFound(service, `Vendor Service ${id}`);
  }

  async findAllByVendor(vendorProfileId: string): Promise<VendorServiceEntity[]> {
    return this.repository.findByVendorProfileId(vendorProfileId);
  }

  async findOne(id: string): Promise<VendorServiceEntity> {
    const service = await this.repository.findOne(id);
    return assertFound(service, `Vendor Service ${id}`);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.repository.remove(id);
    assertFound(deleted, `Vendor Service ${id}`);
    return true;
  }
}
