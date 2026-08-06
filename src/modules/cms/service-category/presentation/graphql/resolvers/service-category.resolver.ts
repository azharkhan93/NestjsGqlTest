import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '@common/presentation/guards';
import { Roles } from '@common/presentation/decorators';
import { UserRole } from '@common/domain/enums';
import { ServiceCategory } from '@modules/cms/service-category/presentation/graphql/types';
import { ServiceCategoryService } from '@modules/cms/service-category/application/services';
import {
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
  SyncServiceCategoryInput,
} from '@modules/cms/service-category/presentation/graphql/inputs';

@Resolver(() => ServiceCategory)
export class ServiceCategoryResolver {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @Query(() => [ServiceCategory], { name: 'serviceCategories' })
  async getCategories() {
    return this.serviceCategoryService.getAllCategories();
  }

  @Mutation(() => ServiceCategory)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async createServiceCategory(
    @Args('input') input: CreateServiceCategoryInput,
  ) {
    return this.serviceCategoryService.createCategory(input.name, input.icon);
  }

  @Mutation(() => ServiceCategory)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateServiceCategory(
    @Args('id') id: string,
    @Args('input') input: UpdateServiceCategoryInput,
  ) {
    return this.serviceCategoryService.updateCategory(
      id,
      input.name,
      input.icon,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async deleteServiceCategory(@Args('id') id: string) {
    return this.serviceCategoryService.deleteCategory(id);
  }

  @Mutation(() => [ServiceCategory])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async syncServiceCategories(
    @Args('categories', { type: () => [SyncServiceCategoryInput] })
    categories: SyncServiceCategoryInput[],
  ) {
    return this.serviceCategoryService.syncCategories(categories);
  }
}
