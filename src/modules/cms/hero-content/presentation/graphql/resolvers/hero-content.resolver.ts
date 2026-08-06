import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, RolesGuard } from '@common/presentation/guards';
import { Roles } from '@common/presentation/decorators';
import { UserRole } from '@common/domain/enums';
import { HeroContentService } from '@modules/cms/hero-content/application/services';
import { HeroContentType, UpdateHeroContentInput } from '../types';

@Resolver(() => HeroContentType)
export class HeroContentResolver {
  constructor(private readonly service: HeroContentService) {}

  @Query(() => HeroContentType, { nullable: true })
  async getHeroContent() {
    return this.service.getHeroContent();
  }

  @Mutation(() => HeroContentType)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateHeroContent(@Args('input') input: UpdateHeroContentInput) {
    return this.service.updateHeroContent(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async deleteHeroContent() {
    return this.service.deleteHeroContent();
  }
}
