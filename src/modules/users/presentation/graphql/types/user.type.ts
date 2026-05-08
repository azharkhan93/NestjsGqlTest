import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  phoneNumber: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  roleId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
