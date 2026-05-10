import { Injectable } from '@nestjs/common';
import { PrismaRepository, PrismaService } from '@common/infrastructure/persistence';
import { HeroContentEntity } from '@modules/cms/hero-content/domain/entities';
import { HeroContent as PrismaHeroContent } from '@prisma/client';
import { IHeroContentRepository } from '@modules/cms/hero-content/domain/repositories';

@Injectable()
export class PrismaHeroContentRepository
  extends PrismaRepository<HeroContentEntity, PrismaHeroContent>
  implements IHeroContentRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'heroContent');
  }

  async findFirst(): Promise<HeroContentEntity | null> {
    const content = await this.model.findFirst();
    return content ? this.toEntity(content) : null;
  }

  async updateOrCreate(data: Partial<HeroContentEntity>): Promise<HeroContentEntity> {
    const existing = await this.model.findFirst();
    
    let result: PrismaHeroContent;
    if (existing) {
      result = await this.model.update({
        where: { id: existing.id },
        data: {
          slide1Url: data.slide1Url,
          slide2Url: data.slide2Url,
          slide3Url: data.slide3Url,
        },
      });
    } else {
      result = await this.model.create({
        data: {
          slide1Url: data.slide1Url,
          slide2Url: data.slide2Url,
          slide3Url: data.slide3Url,
        },
      });
    }
    
    return this.toEntity(result);
  }

  async delete(): Promise<void> {
    await this.model.deleteMany();
  }

  toEntity(model: PrismaHeroContent): HeroContentEntity {
    return new HeroContentEntity({
      id: model.id,
      slide1Url: model.slide1Url ?? undefined,
      slide2Url: model.slide2Url ?? undefined,
      slide3Url: model.slide3Url ?? undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  toPrisma(entity: HeroContentEntity): Record<string, unknown> {
    return {
      slide1Url: entity.slide1Url,
      slide2Url: entity.slide2Url,
      slide3Url: entity.slide3Url,
    };
  }
}
