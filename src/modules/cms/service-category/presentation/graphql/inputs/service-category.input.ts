import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateServiceCategoryInput {
  @Field()
  name: string;

  @Field()
  icon: string;
}

@InputType()
export class UpdateServiceCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  icon?: string;
}

@InputType()
export class SyncServiceCategoryInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field()
  name: string;

  @Field()
  icon: string;
}
