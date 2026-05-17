import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { ServiceCategoryService } from '@modules/cms/service-category/application/services';
import { IServiceCategoryRepository } from '@modules/cms/service-category/domain/repositories';
import { PrismaServiceCategoryRepository } from '@modules/cms/service-category/infrastructure/persistence/repositories';
import { ServiceCategoryResolver } from '@modules/cms/service-category/presentation/graphql/resolvers';

@Module({
  imports: [CommonModule],
  providers: [
    ServiceCategoryService,
    ServiceCategoryResolver,
    {
      provide: IServiceCategoryRepository,
      useClass: PrismaServiceCategoryRepository,
    },
  ],
  exports: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
