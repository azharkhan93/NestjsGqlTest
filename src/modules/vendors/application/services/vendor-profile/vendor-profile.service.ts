import { VendorProfileEntity } from '@modules/vendors/domain/entities';
import { IVendorProfileRepository } from '@modules/vendors/domain/repositories';
import { CreateVendorProfileInput, UpdateVendorProfileInput } from '@modules/vendors/presentation/graphql/inputs';
import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class VendorProfileService {
  constructor(private readonly repository: IVendorProfileRepository) {}

  async create(input: CreateVendorProfileInput) {
    return this.repository.create(VendorProfileEntity.create(input));
  }

  async update(id: string, input: UpdateVendorProfileInput) {
    const profile = await this.repository.update(id, input as any);
    if (!profile) throw new NotFoundException(`Vendor profile ${id} not found`);
    return profile;
  }

  async findByUserId(userId: string) {
    const profile = await this.repository.findByUserId(userId);
    if (!profile) throw new NotFoundException(`Profile for user ${userId} not found`);
    return profile;
  }

  async findById(id: string) {
    const profile = await this.repository.findOne(id);
    if (!profile) throw new NotFoundException(`Profile ${id} not found`);
    return profile;
  }

  async delete(id: string) {
    const profile = await this.repository.remove(id);
    if (!profile) throw new NotFoundException(`Profile ${id} not found`);
    return true;
  }
}
