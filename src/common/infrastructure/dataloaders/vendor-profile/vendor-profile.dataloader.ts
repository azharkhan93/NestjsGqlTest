import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IVendorProfileRepository } from '@modules/vendors/domain/repositories';
import { VendorProfileEntity } from '@modules/vendors/domain/entities';

@Injectable({ scope: Scope.REQUEST })
export class VendorProfileDataLoader {
  private readonly loader: DataLoader<string, VendorProfileEntity | null>;

  constructor(
    private readonly vendorProfileRepository: IVendorProfileRepository,
  ) {
    this.loader = new DataLoader<string, VendorProfileEntity | null>(
      async (vendorProfileIds: readonly string[]) => {
        const profiles = await this.vendorProfileRepository.findByIds([
          ...vendorProfileIds,
        ]);
        const profileMap = new Map<string, VendorProfileEntity>();
        profiles.forEach((p) => {
          if (p) profileMap.set(p.id, p);
        });
        return vendorProfileIds.map((id) => profileMap.get(id) ?? null);
      },
    );
  }

  async load(vendorProfileId: string): Promise<VendorProfileEntity | null> {
    return this.loader.load(vendorProfileId);
  }
}
