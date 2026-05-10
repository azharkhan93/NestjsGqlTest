import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateHeroContentInput {
  @Field({ nullable: true })
  slide1Url?: string;

  @Field({ nullable: true })
  slide2Url?: string;

  @Field({ nullable: true })
  slide3Url?: string;
}
