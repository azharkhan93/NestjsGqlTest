import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@common/domain/enums';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Available user roles',
});

@ObjectType('Role')
export class RoleType {
  @Field(() => ID)
  id: string;

  @Field(() => UserRole)
  name: UserRole;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
