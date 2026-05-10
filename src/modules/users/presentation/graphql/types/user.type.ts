import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RoleType } from '@modules/roles/presentation/graphql/types/role.type';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  phoneNumber: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  avatarPublicId?: string;

  @Field({ nullable: true })
  roleId?: string;

  @Field(() => RoleType, { nullable: true })
  role?: RoleType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
