import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateItemInput } from '../create-item';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => String)
  id: string;
}
