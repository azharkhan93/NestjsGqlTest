import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class AuthPayloadType {
  @Field()
  token: string;

  @Field(() => UserType)
  user: UserType;
}
