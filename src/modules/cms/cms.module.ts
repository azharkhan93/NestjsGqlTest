import { Module } from '@nestjs/common';
import { HeroContentModule } from './hero-content';
import { ServiceCategoryModule } from './service-category';

@Module({
  imports: [HeroContentModule, ServiceCategoryModule],
  exports: [HeroContentModule, ServiceCategoryModule],
})
export class CmsModule {}
