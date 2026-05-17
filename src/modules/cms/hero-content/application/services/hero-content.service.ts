import { Injectable } from '@nestjs/common';
import { IHeroContentRepository } from '@modules/cms/hero-content/domain/repositories';
import { HeroContentEntity } from '@modules/cms/hero-content/domain/entities';

@Injectable()
export class HeroContentService {
  constructor(private readonly repository: IHeroContentRepository) {}

  async getHeroContent(): Promise<HeroContentEntity | null> {
    return this.repository.findFirst();
  }

  async updateHeroContent(
    data: Partial<HeroContentEntity>,
  ): Promise<HeroContentEntity> {
    return this.repository.updateOrCreate(data);
  }

  async deleteHeroContent(): Promise<boolean> {
    await this.repository.delete();
    return true;
  }
}
