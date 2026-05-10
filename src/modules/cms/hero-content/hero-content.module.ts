import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { HeroContentService } from '@modules/cms/hero-content/application/services';
import { HeroContentResolver } from '@modules/cms/hero-content/presentation/graphql/resolvers';
import { IHeroContentRepository } from '@modules/cms/hero-content/domain/repositories';
import { PrismaHeroContentRepository } from '@modules/cms/hero-content/infrastructure/persistence/repositories';

@Module({
  imports: [CommonModule],
  providers: [
    HeroContentService,
    HeroContentResolver,
    {
      provide: IHeroContentRepository,
      useClass: PrismaHeroContentRepository,
    },
  ],
  exports: [HeroContentService],
})
export class HeroContentModule {}
