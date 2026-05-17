import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ServiceCategory {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  icon: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
