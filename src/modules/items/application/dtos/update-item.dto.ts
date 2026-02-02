import { CreateItemInput } from './create-item.dto';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  id: number;
}
