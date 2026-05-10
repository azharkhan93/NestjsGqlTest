import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('HeroContent')
export class HeroContentType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  slide1Url?: string;

  @Field({ nullable: true })
  slide2Url?: string;

  @Field({ nullable: true })
  slide3Url?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
