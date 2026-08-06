import { Injectable } from '@nestjs/common';
import { assertFound, assertOwnerOrAdmin } from '@common/application/helpers';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { IVendorProfileRepository } from '@modules/vendors/domain/repositories';
import { VendorProfileEntity } from '@modules/vendors/domain/entities';
import {
  CreateVendorProfileInput,
  UpdateVendorProfileInput,
} from '@modules/vendors/presentation/graphql/inputs';

@Injectable()
export class VendorProfileService {
  constructor(private readonly repository: IVendorProfileRepository) {}

  async create(input: CreateVendorProfileInput) {
    return this.repository.create(VendorProfileEntity.create(input));
  }

  async createOrUpdate(input: CreateVendorProfileInput) {
    return this.repository.upsertByUserId(VendorProfileEntity.create(input));
  }

  async update(id: string, input: UpdateVendorProfileInput) {
    return assertFound(
      await this.repository.update(id, input as Partial<VendorProfileEntity>),
      `Vendor profile ${id}`,
    );
  }

  async findByUserId(userId: string) {
    return this.repository.findByUserId(userId);
  }

  async findById(id: string) {
    return assertFound(await this.repository.findOne(id), `Profile ${id}`);
  }

  async assertOwnership(
    vendorProfileId: string,
    currentUser: CurrentUserPayload,
    action: string = 'manage this vendor profile',
  ): Promise<VendorProfileEntity> {
    const profile = await this.findById(vendorProfileId);
    assertOwnerOrAdmin(profile.userId, currentUser, action);
    return profile;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async delete(id: string) {
    assertFound(await this.repository.remove(id), `Profile ${id}`);
    return true;
  }

  async search(query: string) {
    return this.repository.search(query);
  }
}
