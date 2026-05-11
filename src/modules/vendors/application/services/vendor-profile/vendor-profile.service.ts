import { Injectable } from '@nestjs/common';
import { assertFound } from '@common/application/helpers';
import { IVendorProfileRepository } from '@modules/vendors/domain/repositories';
import { VendorProfileEntity } from '@modules/vendors/domain/entities';
import { CreateVendorProfileInput, UpdateVendorProfileInput } from '@modules/vendors/presentation/graphql/inputs';

@Injectable()
export class VendorProfileService {
  constructor(private readonly repository: IVendorProfileRepository) { }

  async create(input: CreateVendorProfileInput) {
    return this.repository.create(VendorProfileEntity.create(input));
  }

  async update(id: string, input: UpdateVendorProfileInput) {
    return assertFound(await this.repository.update(id, input as any), `Vendor profile ${id}`);
  }

  async findByUserId(userId: string) {
    return assertFound(await this.repository.findByUserId(userId), `Profile for user ${userId}`);
  }

  async findById(id: string) {
    return assertFound(await this.repository.findOne(id), `Profile ${id}`);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async delete(id: string) {
    assertFound(await this.repository.remove(id), `Profile ${id}`);
    return true;
  }
}
