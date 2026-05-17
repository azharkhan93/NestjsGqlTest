import { IRepository } from '@common/domain/repositories/repository.interface';
import { HeroContentEntity } from '../entities';

export abstract class IHeroContentRepository extends IRepository<HeroContentEntity> {
  abstract findFirst(): Promise<HeroContentEntity | null>;
  abstract updateOrCreate(
    data: Partial<HeroContentEntity>,
  ): Promise<HeroContentEntity>;
  abstract delete(): Promise<void>;
}
