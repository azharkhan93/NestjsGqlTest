import { BaseEntity } from "@common/domain/entities/base.entity";

export class HeroContentEntity extends BaseEntity {
  slide1Url?: string;
  slide2Url?: string;
  slide3Url?: string;

  constructor(partial: Partial<HeroContentEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<HeroContentEntity>): HeroContentEntity {
    return new HeroContentEntity(data);
  }
}
