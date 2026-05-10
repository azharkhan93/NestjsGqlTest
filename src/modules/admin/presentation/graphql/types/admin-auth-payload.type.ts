import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from '@modules/users/presentation/graphql/types/user.type';

@ObjectType()
export class AdminAuthPayloadType {
  @Field()
  token: string;

  @Field(() => UserType)
  user: UserType;
}
