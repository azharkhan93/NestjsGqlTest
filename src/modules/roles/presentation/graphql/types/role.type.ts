import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@modules/roles/domain/entities/role.entity';

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
