import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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
  async updateHeroContent(@Args('input') input: UpdateHeroContentInput) {
    return this.service.updateHeroContent(input);
  }

  @Mutation(() => Boolean)
  async deleteHeroContent() {
    return this.service.deleteHeroContent();
  }
}
