import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@common/presentation/guards';
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
  @UseGuards(GqlAuthGuard)
  async updateHeroContent(@Args('input') input: UpdateHeroContentInput) {
    return this.service.updateHeroContent(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteHeroContent() {
    return this.service.deleteHeroContent();
  }
}
