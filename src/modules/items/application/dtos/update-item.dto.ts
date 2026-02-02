import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateItemInput } from './create-item.dto';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => Int)
  id: number;
}
